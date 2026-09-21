import Link from "next/link";
import CounselorStyleCard from "@/components/CounselorStyleCard";
import { SERVICES, STYLES } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="hero-glow">
      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:py-32">
        <p className="text-on-bg mb-4 text-sm tracking-widest">命理談 MYEONGRI-DAM</p>
        <h1 className="text-on-bg text-4xl leading-tight sm:text-5xl md:text-6xl">
          당신의 사주를
          <br />
          <span className="text-on-bg-accent">AI</span>와 함께 읽어보세요
        </h1>
        <p className="text-on-bg-muted mx-auto mt-6 max-w-xl">
          정확한 사주 데이터와 명리학을 기반으로
          <br className="hidden sm:block" />
          나의 성향과 흐름을 분석합니다.
        </p>
        <Link href="/input" className="btn-primary mt-10 inline-block">
          내 사주 분석하기
        </Link>

        <div className="mx-auto mt-12 max-w-4xl">
          <h2 className="text-on-bg mb-6 text-lg">상담 서비스</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {SERVICES.map((s) => (
              <div key={s.type} className="card text-center">
                <span className="text-3xl">{s.emoji}</span>
                <h3 className="mt-3 font-medium">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{s.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <h2 className="text-on-bg mb-2 text-lg">같은 사주, 다른 상담</h2>
          <p className="text-on-bg-muted mb-6 text-sm">
            동일한 사주 데이터, 동일한 명리학적 근거 — 표현 방식만 다릅니다
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {STYLES.map((s) => (
              <div key={s.type} className="card">
                <CounselorStyleCard
                  type={s.type}
                  title={s.title}
                  description={s.description}
                  avatarSize="lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-6 text-xs">
          {["목", "火", "土", "金", "水"].map((el) => (
            <span
              key={el}
              className="badge-on-bg flex h-10 w-10 items-center justify-center rounded-full px-0"
            >
              {el}
            </span>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-on-bg text-2xl">사주는 데이터를 통해 읽습니다</h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
            {["생년월일", "사주 원국", "음양오행", "명리학 분석", "AI 상담"].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-3">
                <span className="badge-on-bg">{step}</span>
                {i < arr.length - 1 && <span className="text-on-bg-muted">→</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 text-center">
        <Link href="/input" className="btn-primary inline-block">
          지금 시작하기
        </Link>
      </section>
    </div>
  );
}
