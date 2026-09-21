export type CalendarType = "solar" | "lunar";
export type Gender = "male" | "female";
export type ServiceType = "BASIC" | "LOVE" | "SUCCESS";
export type ConsultStyle = "COLD" | "EMPATHETIC";

export interface BirthInput {
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  isFemale: boolean;
  isLunar: boolean;
  birthPlace: string;
  unknownTime?: boolean;
}

export interface Pillar {
  stem: string;
  branch: string;
  stemKo?: string;
  branchKo?: string;
  full: string;
}

export interface ElementCounts {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface StrengthAnalysis {
  level: string;
  analysis: string;
}

export interface DaeunItem {
  startAge: number;
  full: string;
  stem?: string;
  branch?: string;
}

export interface SajuData {
  user: {
    gender: Gender;
    birth: {
      year: number;
      month: number;
      day: number;
      hour: number;
      minute: number;
      calendar: CalendarType;
      birthPlace: string;
      unknownTime?: boolean;
    };
  };
  saju: {
    yearPillar: Pillar;
    monthPillar: Pillar;
    dayPillar: Pillar;
    hourPillar: Pillar | null;
  };
  elements: ElementCounts;
  analysis: {
    strength: StrengthAnalysis;
    tenGods: Record<string, unknown>;
    usefulGod?: Record<string, unknown>;
    favorableGod?: Record<string, unknown>;
    relationships?: Record<string, unknown>;
    sinsal?: string[];
  };
  fortune: {
    daeun: DaeunItem[];
    currentYear?: Record<string, unknown>;
    currentMonth?: Record<string, unknown>;
  };
  meta: {
    source: "sazu" | "ssaju";
    dayMaster: string;
    dayMasterKo?: string;
  };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SessionData {
  birthInput: BirthInput;
  sajuData: SajuData;
  serviceType: ServiceType;
  style: ConsultStyle;
  messages: ChatMessage[];
}
