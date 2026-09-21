import type { ServiceType } from "../saju/types";

const SERVICE_PROMPTS: Record<ServiceType, string> = {
  BASIC: `## 서비스: 기본 사주
다음 항목을 중심으로 종합 상담하세요:
- 사주 원국 구조 (년·월·일·시주)
- 오행 분포와 균형
- 일간(日干) 기준 성격과 기본 성향
- 십성을 통한 인간관계·직업·재물·연애 성향
- 신강/신약과 현재 운의 흐름
- 대운을 통한 인생 흐름 개관`,

  LOVE: `## 서비스: 연애상담
다음 항목을 중심으로 연애 상담하세요:
- 연애 성향과 이성에게 보이는 모습
- 호감 표현 방식, 관계 형성·갈등 패턴
- 배우자궁(일지) 분석
- 재성/관성과 연애운의 연결
- 현재 대운·세운에서의 연애 흐름
- 현실적인 행동 방향
- 상대방 사주 없이 상대 성격·미래를 추측하지 마세요`,

  SUCCESS: `## 서비스: 성공운
다음 항목을 중심으로 성공·커리어 상담하세요:
- 직업 성향, 조직생활 vs 사업 적합성
- 재물 성향, 돈을 버는 방식
- 실행력, 리더십, 인간관계
- 재성·관성·식상·인성·비겁 분석
- 현재 대운·세운에서의 커리어·재물 흐름
- 현실적인 행동 조언`,
};

export function getServicePrompt(serviceType: ServiceType): string {
  return SERVICE_PROMPTS[serviceType];
}

export function getInitialUserMessage(serviceType: ServiceType): string {
  const messages: Record<ServiceType, string> = {
    BASIC: "제 사주를 종합적으로 분석해 주세요. 타고난 성향과 현재 운의 흐름을 알고 싶습니다.",
    LOVE: "제 연애 성향과 현재 연애운을 상담해 주세요.",
    SUCCESS: "제 직업·재물·성취와 관련된 사주 흐름을 분석해 주세요.",
  };
  return messages[serviceType];
}
