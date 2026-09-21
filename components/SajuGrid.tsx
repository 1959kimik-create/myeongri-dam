import type { Pillar } from "@/lib/saju/types";

interface SajuGridProps {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar | null;
  dayMaster?: string;
}

function PillarCell({ pillar, label, highlight }: { pillar: Pillar; label: string; highlight?: boolean }) {
  return (
    <div className={`text-center ${highlight ? "rounded-lg border border-accent/40 bg-accent/5 p-2" : ""}`}>
      <p className="mb-2 text-xs text-ink-muted">{label}</p>
      <p className="text-2xl font-serif text-accent">{pillar.stem}</p>
      <p className="text-xs text-ink-faint">{pillar.stemKo}</p>
      <p className="mt-1 text-2xl font-serif text-ink">{pillar.branch}</p>
      <p className="text-xs text-ink-faint">{pillar.branchKo}</p>
    </div>
  );
}

export default function SajuGrid({ year, month, day, hour, dayMaster }: SajuGridProps) {
  return (
    <div className="card">
      <h2 className="mb-4 text-lg font-medium text-accent">나의 사주</h2>
      <div className={`grid gap-4 ${hour ? "grid-cols-4" : "grid-cols-3"}`}>
        <PillarCell pillar={year} label="년주" />
        <PillarCell pillar={month} label="월주" />
        <PillarCell pillar={day} label="일주" highlight />
        {hour && <PillarCell pillar={hour} label="시주" />}
      </div>
      {dayMaster && (
        <p className="mt-4 text-center text-sm text-ink-muted">
          일간(日干): <span className="text-accent">{dayMaster}</span>
        </p>
      )}
      {!hour && (
        <p className="mt-3 text-center text-xs text-ink-faint">출생 시간 미입력 — 시주는 제외되었습니다</p>
      )}
    </div>
  );
}
