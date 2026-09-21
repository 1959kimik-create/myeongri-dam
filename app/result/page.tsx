"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepNavigation from "@/components/StepNavigation";
import ElementChart from "@/components/ElementChart";
import SajuGrid from "@/components/SajuGrid";
import ServiceSelector from "@/components/ServiceSelector";
import StyleSelector from "@/components/StyleSelector";
import { updateSession } from "@/lib/session";
import { useClientSession, useIsClient } from "@/lib/useClientSession";
import type { ConsultStyle, SajuData, ServiceType } from "@/lib/saju/types";

export default function ResultPage() {
  const router = useRouter();
  const isClient = useIsClient();
  const session = useClientSession();
  const [serviceTypeOverride, setServiceTypeOverride] = useState<ServiceType | null>(null);
  const [styleOverride, setStyleOverride] = useState<ConsultStyle | null>(null);

  const serviceType = serviceTypeOverride ?? session?.serviceType ?? "BASIC";
  const style = styleOverride ?? session?.style ?? "COLD";

  useEffect(() => {
    if (isClient && session === null) {
      router.replace("/input");
    }
  }, [isClient, session, router]);

  if (!isClient || session === null) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-on-bg-muted">
        사주 결과를 불러오는 중...
      </div>
    );
  }

  const { sajuData } = session;
  const { saju, elements, analysis, meta } = sajuData as SajuData;

  function handleStartChat() {
    updateSession({ serviceType, style, messages: [] });
    router.push("/chat");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-12">
      <StepNavigation step="result" />
      <div>
        <h1 className="text-on-bg text-2xl">사주 분석 결과</h1>
        <p className="text-on-bg-muted mt-1 text-sm">
          {meta.source === "sazu" ? "SAZU API" : "로컬 계산 엔진"} 기반 ·{" "}
          {session.birthInput.birthPlace}
        </p>
      </div>

      <SajuGrid
        year={saju.yearPillar}
        month={saju.monthPillar}
        day={saju.dayPillar}
        hour={saju.hourPillar}
        dayMaster={meta.dayMaster}
      />

      <ElementChart elements={elements} />

      <div className="card">
        <h2 className="mb-3 text-lg font-medium text-accent">핵심 분석</h2>
        <div className="space-y-2 text-sm text-ink">
          <p>
            <span className="text-ink-faint">신강/신약:</span> {analysis.strength.level}
          </p>
          {analysis.strength.analysis && (
            <p className="text-ink-muted">{analysis.strength.analysis}</p>
          )}
          {analysis.sinsal && analysis.sinsal.length > 0 && (
            <p>
              <span className="text-ink-faint">신살:</span> {analysis.sinsal.join(", ")}
            </p>
          )}
          {sajuData.fortune.daeun.length > 0 && (
            <p>
              <span className="text-ink-faint">대운:</span>{" "}
              {sajuData.fortune.daeun
                .slice(0, 5)
                .map((d) => `${d.startAge}세 ${d.full}`)
                .join(" → ")}
            </p>
          )}
        </div>
      </div>

      <ServiceSelector
        value={serviceType}
        onChange={(t) => {
          setServiceTypeOverride(t);
          updateSession({ serviceType: t });
        }}
      />

      <StyleSelector
        value={style}
        onChange={(s) => {
          setStyleOverride(s);
          updateSession({ style: s });
        }}
      />

      <button type="button" onClick={handleStartChat} className="btn-primary w-full">
        AI 상담 시작하기
      </button>
    </div>
  );
}
