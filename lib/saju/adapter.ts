import { calculateSaju } from "ssaju";
import type { BirthInput, ElementCounts, Pillar, SajuData } from "./types";

const ELEMENT_MAP: Record<string, keyof ElementCounts> = {
  목: "wood",
  화: "fire",
  토: "earth",
  금: "metal",
  수: "water",
  wood: "wood",
  fire: "fire",
  earth: "earth",
  metal: "metal",
  water: "water",
};

function toPillar(stem: string, branch: string, stemKo?: string, branchKo?: string): Pillar {
  return {
    stem,
    branch,
    stemKo,
    branchKo,
    full: `${stem}${branch}`,
  };
}

function emptyElements(): ElementCounts {
  return { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
}

function mapKoreanElements(source: Record<string, number>): ElementCounts {
  const result = emptyElements();
  for (const [key, count] of Object.entries(source)) {
    const mapped = ELEMENT_MAP[key];
    if (mapped) result[mapped] = count;
  }
  return result;
}

function mapSazuElements(elements: Record<string, { total?: { count?: number } }>): ElementCounts {
  const result = emptyElements();
  for (const [key, value] of Object.entries(elements)) {
    const mapped = ELEMENT_MAP[key] ?? ELEMENT_MAP[key.toLowerCase()];
    if (mapped) result[mapped] = value?.total?.count ?? 0;
  }
  return result;
}

function buildUserBlock(input: BirthInput): SajuData["user"] {
  return {
    gender: input.isFemale ? "female" : "male",
    birth: {
      year: input.birthYear,
      month: input.birthMonth,
      day: input.birthDay,
      hour: input.birthHour,
      minute: input.birthMinute,
      calendar: input.isLunar ? "lunar" : "solar",
      birthPlace: input.birthPlace,
      unknownTime: input.unknownTime,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptSazuResponse(input: BirthInput, data: any): SajuData {
  const modules = data?.modules ?? data?.data?.modules ?? {};
  const fourPillars = modules.fourPillars ?? {};
  const sinStrength = modules.sinStrength ?? {};
  const decadeFortune = modules.decadeFortune ?? {};

  const getPillar = (key: string): Pillar => {
    const p = fourPillars[key] ?? {};
    const stem = p.stem ?? p.stemHanja ?? "";
    const branch = p.branch ?? p.branchHanja ?? "";
    return toPillar(stem, branch, p.stemKo, p.branchKo);
  };

  const hourPillar = input.unknownTime ? null : getPillar("hour");

  return {
    user: buildUserBlock(input),
    saju: {
      yearPillar: getPillar("year"),
      monthPillar: getPillar("month"),
      dayPillar: getPillar("day"),
      hourPillar,
    },
    elements: mapSazuElements(modules.elements ?? {}),
    analysis: {
      strength: {
        level: sinStrength.strength ?? sinStrength.level ?? "미상",
        analysis: sinStrength.analysis ?? sinStrength.description ?? "",
      },
      tenGods: fourPillars,
      usefulGod: modules.usefulGod,
      favorableGod: modules.favorableGod,
      relationships: modules.relationships,
      sinsal: (modules.sinsal?.angels ?? []).map((s: { name: string }) => s.name),
    },
    fortune: {
      daeun: (decadeFortune.list ?? []).map(
        (item: { startAge: number; full: string; stem?: string; branch?: string }) => ({
          startAge: item.startAge,
          full: item.full,
          stem: item.stem,
          branch: item.branch,
        }),
      ),
      currentYear: modules.seun ?? modules.currentYear,
      currentMonth: modules.weolun ?? modules.currentMonth,
    },
    meta: {
      source: "sazu",
      dayMaster: getPillar("day").stem,
      dayMasterKo: fourPillars.day?.stemKo,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptSsajuResponse(input: BirthInput, result: any): SajuData {
  const details = result.pillarDetails ?? {};
  const getFromDetails = (key: string): Pillar => {
    const p = details[key] ?? {};
    return toPillar(p.stem ?? "", p.branch ?? "", p.stemKo, p.branchKo);
  };

  const hourPillar = input.unknownTime ? null : getFromDetails("hour");

  return {
    user: buildUserBlock(input),
    saju: {
      yearPillar: getFromDetails("year"),
      monthPillar: getFromDetails("month"),
      dayPillar: getFromDetails("day"),
      hourPillar,
    },
    elements: mapKoreanElements(result.fiveElements ?? {}),
    analysis: {
      strength: {
        level: result.sinStrength?.level ?? "분석 중",
        analysis: result.sinStrength?.analysis ?? "ssaju 기반 기본 분석",
      },
      tenGods: result.tenGods ?? {},
      relationships: result.branchRelations ?? {},
      sinsal: (Object.values(result.sals ?? {}) as Array<{ specialSals?: string[]; twelveSal?: string }>)
        .flatMap((s) => [...(s.specialSals ?? []), ...(s.twelveSal ? [s.twelveSal] : [])])
        .filter(Boolean),
    },
    fortune: {
      daeun: (result.daeun?.list ?? []).map(
        (item: { startAge?: number; age_range?: string; ganji?: string; full?: string }) => ({
          startAge: item.startAge ?? Number.parseInt(item.age_range ?? "0", 10),
          full: item.full ?? item.ganji ?? "",
        }),
      ),
      currentYear: { year: result.currentYear, age: result.currentAge },
    },
    meta: {
      source: "ssaju",
      dayMaster: result.dayStem ?? getFromDetails("day").stem,
      dayMasterKo: details.day?.stemKo,
    },
  };
}

export function calculateWithSsaju(input: BirthInput): SajuData {
  const result = calculateSaju({
    year: input.birthYear,
    month: input.birthMonth,
    day: input.birthDay,
    hour: input.unknownTime ? 12 : input.birthHour,
    minute: input.unknownTime ? 0 : input.birthMinute,
    gender: input.isFemale ? "여" : "남",
    calendar: input.isLunar ? "lunar" : "solar",
    timezone: "Asia/Seoul",
  });
  return adaptSsajuResponse(input, result);
}

export async function fetchSajuFromSazu(input: BirthInput): Promise<SajuData> {
  const apiKey = process.env.SAZU_API_KEY;
  const baseUrl = process.env.SAZU_API_BASE ?? "https://api.sazu.app";

  if (!apiKey) {
    return calculateWithSsaju(input);
  }

  const response = await fetch(`${baseUrl}/v2/sazu/manse`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      birthYear: input.birthYear,
      birthMonth: input.birthMonth,
      birthDay: input.birthDay,
      birthHour: input.unknownTime ? 12 : input.birthHour,
      birthMinute: input.unknownTime ? 0 : input.birthMinute,
      isFemale: input.isFemale,
      isLunar: input.isLunar,
    }),
  });

  if (!response.ok) {
    console.warn("SAZU API failed, falling back to ssaju:", response.status);
    return calculateWithSsaju(input);
  }

  const data = await response.json();
  return adaptSazuResponse(input, data);
}
