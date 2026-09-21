"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BIRTH_CITIES } from "@/lib/constants";
import { clampInt, daysInMonth, isValidBirthDate } from "@/lib/birthDate";
import { saveSession } from "@/lib/session";
import { useIsClient } from "@/lib/useClientSession";
import type { BirthInput, SajuData } from "@/lib/saju/types";

const CURRENT_YEAR = new Date().getFullYear();

const formSchema = z
  .object({
    calendar: z.enum(["solar", "lunar"]),
    birthYear: z.number().int().min(1920).max(CURRENT_YEAR),
    birthMonth: z.number().int().min(1).max(12),
    birthDay: z.number().int().min(1).max(31),
    birthHour: z.number().int().min(0).max(23),
    birthMinute: z.number().int().min(0).max(59),
    gender: z.enum(["male", "female"]),
    birthPlace: z.string().min(1),
    unknownTime: z.boolean(),
  })
  .refine((data) => isValidBirthDate(data.birthYear, data.birthMonth, data.birthDay), {
    message: "존재하지 않는 날짜입니다.",
    path: ["birthDay"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function BirthForm() {
  const isClient = useIsClient();
  if (!isClient) {
    return (
      <div className="flex min-h-[320px] items-center justify-center text-sm text-ink-muted">
        입력 폼을 불러오는 중...
      </div>
    );
  }

  return <BirthFormFields />;
}

function BirthFormFields() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unknownTime, setUnknownTime] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      calendar: "solar",
      birthYear: 1990,
      birthMonth: 5,
      birthDay: 15,
      birthHour: 12,
      birthMinute: 0,
      gender: "male",
      birthPlace: "서울",
      unknownTime: false,
    },
  });

  const birthYear = watch("birthYear");
  const birthMonth = watch("birthMonth");
  const birthDay = watch("birthDay");
  const maxDay = daysInMonth(birthYear, birthMonth);

  useEffect(() => {
    if (birthDay > maxDay) {
      setValue("birthDay", maxDay, { shouldValidate: true });
    }
  }, [birthYear, birthMonth, birthDay, maxDay, setValue]);

  function bindClampedNumber(
    name: keyof Pick<
      FormValues,
      "birthYear" | "birthMonth" | "birthDay" | "birthHour" | "birthMinute"
    >,
    min: number,
    max: number,
  ) {
    const { onChange, onBlur, ...rest } = register(name, { valueAsNumber: true });

    return {
      ...rest,
      type: "number" as const,
      min,
      max,
      inputMode: "numeric" as const,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        if (raw === "") {
          onChange(e);
          return;
        }
        const clamped = clampInt(Number(raw), min, max);
        e.target.value = String(clamped);
        setValue(name, clamped, { shouldValidate: true });
      },
      onBlur: (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const clamped = clampInt(raw === "" ? min : Number(raw), min, max);
        e.target.value = String(clamped);
        setValue(name, clamped, { shouldValidate: true });
        onBlur(e);
      },
    };
  }

  async function onSubmit(values: FormValues) {
    setLoading(true);
    setError(null);

    const birthInput: BirthInput = {
      birthYear: values.birthYear,
      birthMonth: values.birthMonth,
      birthDay: values.birthDay,
      birthHour: values.birthHour,
      birthMinute: values.birthMinute,
      isFemale: values.gender === "female",
      isLunar: values.calendar === "lunar",
      birthPlace: values.birthPlace,
      unknownTime,
    };

    try {
      const res = await fetch("/api/saju", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(birthInput),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error ?? "사주 계산에 실패했습니다.");
      }

      const sajuData = json.data as SajuData;
      saveSession({
        birthInput,
        sajuData,
        serviceType: "BASIC",
        style: "COLD",
        messages: [],
      });

      router.push("/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const dayOptions = Array.from({ length: maxDay }, (_, i) => i + 1);
  const hourOptions = Array.from({ length: 24 }, (_, i) => i);
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="mb-2 block text-sm text-ink-muted">달력</label>
        <div className="flex gap-4">
          {(["solar", "lunar"] as const).map((cal) => (
            <label key={cal} className="flex cursor-pointer items-center gap-2">
              <input type="radio" value={cal} {...register("calendar")} className="accent-accent" />
              <span>{cal === "solar" ? "양력" : "음력"}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-ink-muted">생년월일</label>
        <div className="grid grid-cols-3 gap-3">
          <input
            placeholder="년"
            className="input-field"
            {...bindClampedNumber("birthYear", 1920, CURRENT_YEAR)}
          />
          <select
            {...register("birthMonth", { valueAsNumber: true })}
            className="input-field"
            aria-label="월"
          >
            {monthOptions.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
          <select
            {...register("birthDay", { valueAsNumber: true })}
            className="input-field"
            aria-label="일"
          >
            {dayOptions.map((d) => (
              <option key={d} value={d}>
                {d}일
              </option>
            ))}
          </select>
        </div>
        {(errors.birthYear || errors.birthMonth || errors.birthDay) && (
          <p className="mt-1 text-sm text-red-600">
            {errors.birthDay?.message ?? "올바른 생년월일을 입력해 주세요."}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm text-ink-muted">태어난 시간</label>
        <div className="grid grid-cols-2 gap-3">
          <select
            {...register("birthHour", { valueAsNumber: true })}
            disabled={unknownTime}
            className="input-field disabled:opacity-40"
            aria-label="시"
          >
            {hourOptions.map((h) => (
              <option key={h} value={h}>
                {String(h).padStart(2, "0")}시
              </option>
            ))}
          </select>
          <select
            {...register("birthMinute", { valueAsNumber: true })}
            disabled={unknownTime}
            className="input-field disabled:opacity-40"
            aria-label="분"
          >
            {minuteOptions.map((m) => (
              <option key={m} value={m}>
                {String(m).padStart(2, "0")}분
              </option>
            ))}
          </select>
        </div>
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={unknownTime}
            onChange={(e) => {
              const checked = e.target.checked;
              setUnknownTime(checked);
              setValue("unknownTime", checked);
              if (checked) {
                setValue("birthHour", 12);
                setValue("birthMinute", 0);
              }
            }}
            className="accent-accent"
          />
          태어난 시간을 모르겠어요 (시주 제외)
        </label>
      </div>

      <div>
        <label className="mb-2 block text-sm text-ink-muted">성별</label>
        <div className="flex gap-4">
          {(["male", "female"] as const).map((g) => (
            <label key={g} className="flex cursor-pointer items-center gap-2">
              <input type="radio" value={g} {...register("gender")} className="accent-accent" />
              <span>{g === "male" ? "남성" : "여성"}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-ink-muted">출생지역</label>
        <select {...register("birthPlace")} className="input-field w-full">
          {BIRTH_CITIES.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50/80 px-4 py-3 text-sm text-red-700 backdrop-blur-sm">
          {error}
        </div>
      )}

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "사주 분석 중..." : "사주 분석하기"}
      </button>
    </form>
  );
}
