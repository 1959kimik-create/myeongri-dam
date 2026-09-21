"use client";

import { useEffect, useRef, useState } from "react";
import CounselorAvatar from "@/components/CounselorAvatar";
import { STYLES } from "@/lib/constants";
import { getInitialUserMessage } from "@/lib/prompts/services";
import { updateSession } from "@/lib/session";
import type { ChatMessage, ConsultStyle, SajuData, ServiceType } from "@/lib/saju/types";

interface ChatInterfaceProps {
  sajuData: SajuData;
  serviceType: ServiceType;
  style: ConsultStyle;
  initialMessages?: ChatMessage[];
  onStyleChange?: (style: ConsultStyle) => void;
}

export default function ChatInterface({
  sajuData,
  serviceType,
  style,
  initialMessages = [],
  onStyleChange,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(initialMessages.length > 0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!initialized) {
      void sendMessage(getInitialUserMessage(serviceType), true);
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function streamChat(msgs: ChatMessage[], currentStyle: ConsultStyle): Promise<ChatMessage[]> {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sajuData,
        serviceType,
        style: currentStyle,
        messages: msgs,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "상담 요청 실패" }));
      throw new Error(err.error ?? "상담 요청 실패");
    }

    const reader = res.body?.getReader();
    if (!reader) throw new Error("스트리밍을 시작할 수 없습니다.");

    const decoder = new TextDecoder();
    let assistantText = "";

    setMessages([...msgs, { role: "assistant", content: "" }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      assistantText += decoder.decode(value, { stream: true });
      setMessages([...msgs, { role: "assistant", content: assistantText }]);
    }

    return [...msgs, { role: "assistant", content: assistantText }];
  }

  async function sendMessage(text: string, isInitial = false) {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text.trim() };
    const nextMessages = isInitial ? [userMsg] : [...messages, userMsg];
    setMessages(nextMessages);

    setInput("");
    setLoading(true);

    try {
      const finalMessages = await streamChat(nextMessages, style);
      updateSession({ messages: finalMessages, style, serviceType });
    } catch (err) {
      const errorMessages: ChatMessage[] = [
        ...nextMessages,
        {
          role: "assistant",
          content: err instanceof Error ? err.message : "오류가 발생했습니다.",
        },
      ];
      setMessages(errorMessages);
      updateSession({ messages: errorMessages, style, serviceType });
    } finally {
      setLoading(false);
    }
  }

  function handleStyleSwitch(newStyle: ConsultStyle) {
    onStyleChange?.(newStyle);
  }

  return (
    <div className="flex h-[calc(100vh-12rem)] flex-col">
      <div className="mb-4 grid gap-2 sm:grid-cols-2">
        {STYLES.map((s) => (
          <button
            key={s.type}
            type="button"
            onClick={() => handleStyleSwitch(s.type)}
            disabled={loading}
            className={`card flex items-center gap-2 !p-3 text-left text-sm transition-all ${
              style === s.type
                ? "border-4 border-[#f0e8d0] shadow-sm"
                : "hover:border-accent/50"
            }`}
          >
            <CounselorAvatar style={s.type} size="sm" />
            <span className="font-medium">{s.title}</span>
          </button>
        ))}
      </div>

      <div
        className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-border-warm p-4 shadow-sm backdrop-blur-md"
        style={{ backgroundColor: "color-mix(in srgb, var(--paper-light) 70%, transparent)" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                msg.role === "user"
                  ? "bg-accent/15 text-ink"
                  : "border border-border-warm bg-white/80 text-ink backdrop-blur-sm"
              }`}
            >
              {msg.content || (loading && i === messages.length - 1 ? "..." : "")}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage(input);
        }}
        className="mt-4 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="궁금한 점을 질문해 보세요..."
          disabled={loading}
          className="input-field flex-1"
        />
        <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-6">
          전송
        </button>
      </form>
    </div>
  );
}
