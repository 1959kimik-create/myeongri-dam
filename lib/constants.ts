import type { ServiceType, ConsultStyle } from "./saju/types";

export const BIRTH_CITIES = [
  { name: "서울", latitude: 37.5665, longitude: 126.978 },
  { name: "부산", latitude: 35.1796, longitude: 129.0756 },
  { name: "대구", latitude: 35.8714, longitude: 128.6014 },
  { name: "인천", latitude: 37.4563, longitude: 126.7052 },
  { name: "광주", latitude: 35.1595, longitude: 126.8526 },
  { name: "대전", latitude: 36.3504, longitude: 127.3845 },
  { name: "울산", latitude: 35.5384, longitude: 129.3114 },
  { name: "세종", latitude: 36.48, longitude: 127.289 },
  { name: "수원", latitude: 37.2636, longitude: 127.0286 },
  { name: "제주", latitude: 33.4996, longitude: 126.5312 },
] as const;

export const SERVICES: {
  type: ServiceType;
  title: string;
  description: string;
  emoji: string;
}[] = [
  {
    type: "BASIC",
    title: "기본 사주",
    description: "타고난 성향과 인생의 흐름을 분석합니다.",
    emoji: "☯",
  },
  {
    type: "LOVE",
    title: "연애상담",
    description: "연애 성향과 관계의 흐름을 살펴봅니다.",
    emoji: "💫",
  },
  {
    type: "SUCCESS",
    title: "성공운",
    description: "직업, 재물, 성취와 관련된 흐름을 분석합니다.",
    emoji: "✦",
  },
];

export const STYLES: {
  type: ConsultStyle;
  title: string;
  description: string;
}[] = [
  {
    type: "COLD",
    title: "냉철한 상담가",
    description: "명리학적 근거를 바탕으로 현재 상황을 명확하게 분석합니다.",
  },
  {
    type: "EMPATHETIC",
    title: "공감형 상담가",
    description: "같은 사주를 더 따뜻하고 부드러운 방식으로 설명합니다.",
  },
];

export const ELEMENT_LABELS: Record<
  keyof import("./saju/types").ElementCounts,
  { hanja: string; label: string; color: string }
> = {
  wood: { hanja: "木", label: "목", color: "#4ade80" },
  fire: { hanja: "火", label: "화", color: "#f87171" },
  earth: { hanja: "土", label: "토", color: "#fbbf24" },
  metal: { hanja: "金", label: "금", color: "#94a3b8" },
  water: { hanja: "水", label: "수", color: "#60a5fa" },
};

export const SESSION_KEY = "myeongri-dam-session";
