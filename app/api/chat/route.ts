import { NextRequest } from "next/server";
import OpenAI from "openai";
import { z } from "zod";
import { buildBaseSystemPrompt } from "@/lib/prompts/base";
import { getServicePrompt } from "@/lib/prompts/services";
import { getStylePrompt } from "@/lib/prompts/styles";
import type { SajuData } from "@/lib/saju/types";

const chatSchema = z.object({
  sajuData: z.record(z.string(), z.unknown()),
  serviceType: z.enum(["BASIC", "LOVE", "SUCCESS"]),
  style: z.enum(["COLD", "EMPATHETIC"]),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    }),
  ),
});

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "OPENAI_API_KEY가 설정되지 않았습니다." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "요청 형식이 올바르지 않습니다." }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { sajuData, serviceType, style, messages } = parsed.data;
    const systemPrompt = [
      buildBaseSystemPrompt(sajuData as unknown as SajuData),
      getServicePrompt(serviceType),
      getStylePrompt(style),
    ].join("\n\n");

    const openai = new OpenAI({ apiKey });

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content ?? "";
            if (text) controller.enqueue(encoder.encode(text));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "AI 상담 중 오류가 발생했습니다." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
