"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/session";

type Step = "input" | "result" | "chat";

const STEP_CONFIG: Record<
  Step,
  { back: { href: string; label: string } | null; homeLabel: string }
> = {
  input: {
    back: { href: "/", label: "← 홈" },
    homeLabel: "초기화면",
  },
  result: {
    back: { href: "/input", label: "← 사주 입력" },
    homeLabel: "초기화면",
  },
  chat: {
    back: { href: "/result", label: "← 사주 결과" },
    homeLabel: "초기화면",
  },
};

interface StepNavigationProps {
  step: Step;
}

export default function StepNavigation({ step }: StepNavigationProps) {
  const router = useRouter();
  const { back, homeLabel } = STEP_CONFIG[step];

  function goHome() {
    clearSession();
    router.push("/");
  }

  return (
    <nav className="mb-6 flex items-center justify-between gap-3">
      {back ? (
        <Link href={back.href} className="nav-step-btn">
          {back.label}
        </Link>
      ) : (
        <span />
      )}
      <button type="button" onClick={goHome} className="nav-step-btn-home">
        ⌂ {homeLabel}
      </button>
    </nav>
  );
}
