"use client";

import CounselorStyleCard from "@/components/CounselorStyleCard";
import { STYLES } from "@/lib/constants";
import type { ConsultStyle } from "@/lib/saju/types";

interface StyleSelectorProps {
  value: ConsultStyle;
  onChange: (style: ConsultStyle) => void;
}

export default function StyleSelector({ value, onChange }: StyleSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-on-bg text-base">상담 스타일 선택</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {STYLES.map((style) => (
          <button
            key={style.type}
            type="button"
            onClick={() => onChange(style.type)}
            className={`card cursor-pointer transition-all ${
              value === style.type
                ? "border-4 border-[#f0e8d0] shadow-sm"
                : "hover:border-accent/50"
            }`}
          >
            <CounselorStyleCard
              type={style.type}
              title={style.title}
              description={style.description}
              avatarSize="md"
              titleClassName="font-medium text-sm"
              descriptionClassName="mt-1 text-xs text-ink-muted"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
