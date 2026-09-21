"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ChatInterface from "@/components/ChatInterface";
import StepNavigation from "@/components/StepNavigation";
import { updateSession } from "@/lib/session";
import { useClientSession, useIsClient } from "@/lib/useClientSession";
import type { ConsultStyle } from "@/lib/saju/types";

export default function ChatPage() {
  const router = useRouter();
  const isClient = useIsClient();
  const session = useClientSession();
  const [styleOverride, setStyleOverride] = useState<ConsultStyle | null>(null);
  const style = styleOverride ?? session?.style ?? "COLD";

  useEffect(() => {
    if (isClient && session === null) {
      router.replace("/input");
    }
  }, [isClient, session, router]);

  if (!isClient || session === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-on-bg-muted">
        상담을 준비하는 중...
      </div>
    );
  }

  const serviceLabel =
    session.serviceType === "BASIC"
      ? "기본 사주"
      : session.serviceType === "LOVE"
        ? "연애상담"
        : "성공운";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <StepNavigation step="chat" />
      <div className="mb-6">
        <h1 className="text-on-bg text-2xl">AI 사주 상담</h1>
        <p className="text-on-bg-muted mt-1 text-sm">
          {serviceLabel} · 일간 {session.sajuData.meta.dayMaster}
        </p>
      </div>

      <ChatInterface
        key={`${session.serviceType}-${style}`}
        sajuData={session.sajuData}
        serviceType={session.serviceType}
        style={style}
        initialMessages={session.messages}
        onStyleChange={(s) => {
          setStyleOverride(s);
          updateSession({ style: s, messages: [] });
        }}
      />
    </div>
  );
}
