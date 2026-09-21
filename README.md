# 명리담 (命理談) — AI 사주 상담 MVP

정확한 사주 데이터와 명리학을 기반으로 AI가 상담하는 웹 서비스입니다.

## 기술 스택

- Next.js 16 (App Router)
- Tailwind CSS 4
- SAZU 만세력 API (사주 계산)
- ssaju (API 키 없을 때 로컬 fallback)
- OpenAI gpt-4o-mini (AI 상담)

## 시작하기

```bash
cd myeongri-dam
npm install
cp .env.example .env.local
# .env.local 에 OPENAI_API_KEY 설정 (필수)
# SAZU_API_KEY 설정 (선택, 없으면 ssaju 사용)
npm run dev
```

http://localhost:3000 에서 확인

## 사용자 플로우

1. `/` — 랜딩 페이지
2. `/input` — 출생정보 입력
3. `/result` — 사주 결과 (4주 + 오행)
4. `/chat` — AI 상담 (기본/연애/성공 × 냉철/공감)

## 환경변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `OPENAI_API_KEY` | ✅ | AI 상담 |
| `SAZU_API_KEY` | ❌ | SAZU API (없으면 ssaju) |
| `SAZU_API_BASE` | ❌ | 기본 `https://api.sazu.app` |

## 프로젝트 문서

| 파일 | 설명 |
|------|------|
| `기획안.md` | 서비스 기획서 |
| `사주계산방법.md` | 사주 계산 엔진 기획 |

## 원본 소스 파일 (`source/`)

| 파일 | 설명 |
|------|------|
| `source/배경동영상.jpeg` | 배경 이미지 원본 |
| `public/bg-video.mp4` | 웹 배경용 동영상 (실행 시 사용) |

## 배포 (Vercel)

```bash
npx vercel
```

Vercel 대시보드에서 환경변수를 설정하세요.
