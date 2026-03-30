# CLAUDE.md — bizmart-web

## 프로젝트 개요
비즈마트 B2B 쇼핑몰 프론트엔드 (포트폴리오용)
소상공인 대상 AI 트렌드 인사이트 종합 도매 플랫폼

## 문서 참조
- 전체 문서 목차 → `docs/README.md`
- 프로젝트 구조 → `docs/architecture.md`
- 기획 및 기능 명세 → `docs/planning.md`
- 변경 이력 → `docs/changelog.md`
- 페이지별 API 사용 명세 → `docs/api-usage.md`
- 페이지별 인수인계 → `docs/pages/`

## 기술 스택
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS + shadcn/ui
- Animation: Framer Motion
- State: Zustand (클라이언트), TanStack Query (서버)
- Auth: 이메일 + 비밀번호 (JWT)
- HTTP Client: Axios (REST API)
- 결제: Mock 결제 (즉시 완료 처리)

## 코드 스타일
- ES modules 사용 (import/export), CommonJS(require) 금지
- 컴포넌트는 named export 사용
- 파일명: kebab-case (예: product-card.tsx)
- 컴포넌트명: PascalCase
- TypeScript strict 모드 유지
- `any` 타입 사용 금지

## 디렉토리 구조
```
src/
├── app/          # Next.js App Router 페이지
├── components/   # 재사용 컴포넌트
├── lib/          # API 클라이언트, auth 유틸, queries
├── store/        # Zustand 스토어
└── types/        # 공통 타입 정의
```

## 주요 규칙
- 컴포넌트 최상단에 "use client" 필요 여부 명시
- 환경변수는 반드시 `.env.local` 사용, 코드에 하드코딩 금지
- 결제는 Mock 처리 — 실제 PG 연동 없음
- API 호출은 TanStack Query로 처리
- 에러 바운더리 필수 적용 (src/app/error.tsx)

## 워크플로우
- 타입 체크: `npx tsc --noEmit`
- 린트: `npm run lint`
- 개발 서버: `npm run dev`
- 빌드: `npm run build`
