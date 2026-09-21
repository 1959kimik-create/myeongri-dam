"use client";

import { SERVICES } from "@/lib/constants";
import type { ServiceType } from "@/lib/saju/types";

interface ServiceSelectorProps {
  value: ServiceType;
  onChange: (type: ServiceType) => void;
}

export default function ServiceSelector({ value, onChange }: ServiceSelectorProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-on-bg text-base">상담 서비스 선택</h3>
      <div className="grid gap-3 sm:grid-cols-3">
        {SERVICES.map((service) => (
          <button
            key={service.type}
            type="button"
            onClick={() => onChange(service.type)}
            className={`card cursor-pointer text-left transition-all ${
              value === service.type
                ? "border-4 border-[#f0e8d0] shadow-sm"
                : "hover:border-accent/50"
            }`}
          >
            <span className="text-2xl">{service.emoji}</span>
            <h4 className="mt-2 font-medium">{service.title}</h4>
            <p className="mt-1 text-xs text-ink-muted">{service.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
