import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchSajuFromSazu } from "@/lib/saju/adapter";
import type { BirthInput } from "@/lib/saju/types";

const birthSchema = z.object({
  birthYear: z.number().int().min(1900).max(2100),
  birthMonth: z.number().int().min(1).max(12),
  birthDay: z.number().int().min(1).max(31),
  birthHour: z.number().int().min(0).max(23),
  birthMinute: z.number().int().min(0).max(59),
  isFemale: z.boolean(),
  isLunar: z.boolean(),
  birthPlace: z.string().min(1),
  unknownTime: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = birthSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "입력값이 올바르지 않습니다.", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const input: BirthInput = parsed.data;
    const sajuData = await fetchSajuFromSazu(input);

    return NextResponse.json({ data: sajuData });
  } catch (error) {
    console.error("Saju calculation error:", error);
    return NextResponse.json(
      { error: "사주 계산 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
