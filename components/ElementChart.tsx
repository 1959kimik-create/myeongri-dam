"use client";

import { useState } from "react";
import { ELEMENT_LABELS } from "@/lib/constants";
import type { ElementCounts } from "@/lib/saju/types";

const ELEMENT_DESCRIPTIONS: Record<keyof ElementCounts, string> = {
  wood: "목(木)은 성장, 확장, 시작과 관련된 의미로 해석됩니다.",
  fire: "화(火)는 열정, 표현, 활동과 관련된 의미로 해석됩니다.",
  earth: "토(土)는 안정, 중재, 현실과 관련된 의미로 해석됩니다.",
  metal: "금(金)은 결단, 원칙, 정리와 관련된 의미로 해석됩니다.",
  water: "수(水)는 지혜, 유연, 내면과 관련된 의미로 해석됩니다.",
};

interface ElementChartProps {
  elements: ElementCounts;
}

export default function ElementChart({ elements }: ElementChartProps) {
  const [selected, setSelected] = useState<keyof ElementCounts | null>(null);
  const max = Math.max(...Object.values(elements), 1);

  return (
    <div className="card">
      <h2 className="mb-4 text-lg font-medium text-accent">오행 분포</h2>
      <div className="space-y-3">
        {(Object.keys(elements) as (keyof ElementCounts)[]).map((key) => {
          const info = ELEMENT_LABELS[key];
          const count = elements[key];
          const width = `${(count / max) * 100}%`;
          const isSelected = selected === key;

          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelected(isSelected ? null : key)}
              className="w-full text-left transition-opacity hover:opacity-90"
            >
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>
                  {info.label}({info.hanja})
                </span>
                <span className="text-ink-muted">{count}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-border-warm/60">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width, backgroundColor: info.color }}
                />
              </div>
              {isSelected && (
                <p className="mt-2 text-xs text-ink-muted">{ELEMENT_DESCRIPTIONS[key]}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
