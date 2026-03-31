<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-000?style=for-the-badge&logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-E81899?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</p>

<h1 align="center">BizMart</h1>
<p align="center"><strong>소상공인을 위한 AI 트렌드 인사이트 B2B 도매 플랫폼</strong></p>
<p align="center">카페, 식당, 미용실 사장님들이 데이터 기반으로 똑똑하게 도매 구매하는 플랫폼</p>

---

## Overview

BizMart는 소상공인을 위한 B2B 종합 도매 쇼핑몰입니다.
AI 기반 트렌드 분석, 개인화 추천, 수요 예측으로 **"무엇을, 언제, 얼마나 주문할지"** 를 데이터로 알려줍니다.

---

## Features

### Shopping

| 기능 | 설명 |
|------|------|
| **상품 탐색** | 6개 카테고리 필터, 검색 (300ms 디바운스), 정렬 (인기/가격/최신) |
| **상품 상세** | MOQ 표시, 수량 선택, 실시간 금액 계산, 브레드크럼 네비게이션 |
| **장바구니** | Zustand + localStorage persist, 수량 조절, 삭제 애니메이션 |
| **결제** | Mock 결제 (데모), 배송 정보, 결제수단 선택, 동의 체크 |
| **주문 관리** | 상태별 필터 탭, 배송 4단계 타임라인, 재주문 기능 |

### AI Features

| 기능 | 설명 |
|------|------|
| **AI 맞춤 추천** | 업종/주문 패턴 기반 개인화 추천, 추천 이유 뱃지, 점수 링 |
| **수요 예측** | 4주 수요 예측 바 차트, 통계 카드 (성장/주의), 차트/테이블 토글 |
| **AI 챗봇** | 전 페이지 플로팅 위젯, 상품 검색/주문 확인/추천/트렌드 응답 |
| **트렌드 리포트** | TOP 10 인기 상품, 카테고리 분포 차트, AI 분석 코멘트 |
| **업종별 베스트셀러** | 5개 업종 탭, 함께 구매한 상품, 담기 기능 |
| **AI 인사이트** | Gemini AI 기반 자연어 분석 (4개 페이지에 통합) |

### User

| 기능 | 설명 |
|------|------|
| **회원가입/로그인** | 이메일 + 비밀번호 (JWT), 사업자 정보 입력 |
| **마이페이지** | 사업자 정보 수정 (PATCH), 회원 등급, 로그아웃 |
| **정기구독 관리** | 구독 상품 토글 (데모 UI) |

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Next.js 14** (App Router) | 파일 기반 라우팅, SSR/SSG |
| Language | **TypeScript** (strict) | 타입 안전성 |
| Styling | **Tailwind CSS** + shadcn/ui | 유틸리티 클래스 + 디자인 시스템 |
| Animation | **Framer Motion** | 선언적 애니메이션, AnimatePresence |
| Server State | **TanStack Query** | 캐싱, 자동 리페치, 로딩/에러 관리 |
| Client State | **Zustand** | 인증 + 장바구니 전역 상태 |
| HTTP | **Axios** | 인터셉터 (토큰 주입, 401 처리) |
| Icons | **Lucide React** | 트리셰이킹 가능 |
| Testing | **Jest** + React Testing Library | 63개 테스트 |

---

## Pages

```
/                    홈 (히어로, 트렌드, 카테고리, 추천상품)
/login               로그인
/register            회원가입 (사업자 정보)
/products            상품 목록 (필터, 검색, 페이지네이션)
/products/[id]       상품 상세 (수량, 장바구니, 바로구매)
/cart                장바구니 (수량 조절, 주문 요약)
/checkout            결제 (Mock 결제)
/orders              주문 내역 (상태 필터 탭)
/orders/[id]         배송 조회 (4단계 타임라인)
/trend               트렌드 리포트 (TOP 10, 카테고리 분포)
/trend/best          업종별 베스트셀러 (5개 업종 탭)
/recommend           AI 맞춤 추천 (추천 이유, 점수)
/forecast            수요 예측 대시보드 (차트, 테이블)
/mypage              마이페이지 (정보 수정, 등급)
/mypage/subscription 정기구독 관리 (토글)
```

---

## Architecture

```
src/
├── app/                 # 15개 페이지 (App Router)
├── components/
│   ├── header.tsx       # 공통 헤더 (반응형, 장바구니 뱃지)
│   ├── product-card.tsx # 상품 카드 (담기 피드백)
│   ├── ai-insight-card  # AI 분석 카드 (4개 페이지 공통)
│   ├── recommend/       # 추천 카드 (점수 링, 이유 뱃지)
│   ├── forecast/        # 바 차트, 테이블
│   ├── chatbot/         # 위젯, 대화창, 메시지, 타이핑
│   └── ui/              # shadcn/ui 기본 컴포넌트
├── lib/
│   ├── api.ts           # Axios (인터셉터, 401 처리)
│   ├── queries.ts       # TanStack Query 훅 12개
│   ├── mock/            # Mock 엔진 (추천, 예측, 챗봇)
│   └── product-visuals  # 카테고리별 이모지/그라데이션
├── store/
│   ├── auth-store.ts    # 인증 (login, logout, hydrate)
│   ├── cart-store.ts    # 장바구니 (persist)
│   └── chat-store.ts    # 채팅 (persist)
└── types/index.ts       # 공통 타입 정의
```

---

## Design System

**60 : 30 : 10 색상 규칙**

| Ratio | Role | Color | Usage |
|-------|------|-------|-------|
| 60% | Background | `#F8FAFC` `#FFFFFF` | 페이지/카드 배경 |
| 30% | Primary | `#1A3A6B` | 헤더, 버튼, 강조 |
| 10% | Accent | `#2563EB` | 호버, 뱃지, 링크 |

**접근성**: WCAG AA 준수, ARIA 52개소, skip-to-content, `prefers-reduced-motion` 지원

**반응형**: 모바일 → 태블릿 → 데스크톱 (320px ~ 1280px)

---

## Getting Started

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local

# 3. 개발 서버
npm run dev
```

http://localhost:3000 에서 확인

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 개발 서버 (http://localhost:3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint 검사 |
| `npm test` | Jest 테스트 (63개) |
| `npx tsc --noEmit` | TypeScript 타입 체크 |

---

## API Integration

백엔드 API 먼저 시도 → 실패 시 Mock 자동 전환 (try/catch + dynamic import)

| API | Method | Endpoint | Status |
|-----|--------|----------|--------|
| 회원가입 | POST | `/auth/register` | Backend |
| 로그인 | POST | `/auth/login` | Backend |
| 상품 목록 | GET | `/products` | Backend |
| 상품 상세 | GET | `/products/:id` | Backend |
| 주문 생성 | POST | `/orders` | Backend |
| 주문 목록 | GET | `/orders` | Backend |
| 트렌드 | GET | `/trend/report` | Backend |
| 베스트셀러 | GET | `/trend/best` | Backend |
| AI 추천 | GET | `/recommend` | Backend + Mock fallback |
| 수요 예측 | GET | `/forecast` | Backend + Mock fallback |
| 챗봇 | - | - | Mock (패턴 매칭) |

---

## Documentation

| Document | Description |
|----------|-------------|
| [`docs/README.md`](./docs/README.md) | 문서 목차 |
| [`docs/architecture.md`](./docs/architecture.md) | 기술 스택, 구조, 컴포넌트, 스토어 |
| [`docs/pages/`](./docs/pages/_overview.md) | 페이지별 인수인계 (13개) |
| [`docs/api-usage.md`](./docs/api-usage.md) | 페이지별 API 호출 명세 |
| [`docs/backend-api-requirements.md`](./docs/backend-api-requirements.md) | 백엔드 API 전체 스키마 |
| [`docs/planning.md`](./docs/planning.md) | 기획서, UI/UX, 로드맵 |
| [`docs/changelog.md`](./docs/changelog.md) | 변경 이력 |

---

## Quality

| Metric | Score |
|--------|-------|
| Audit Score | **17/20** (Good) |
| Accessibility | WCAG AA, ARIA 52개소 |
| Performance | Framer Motion, staleTime 60s |
| Responsive | 320px ~ 1280px |
| Anti-Patterns | 0개 (gradient/blur/glassmorphism 제거) |
| Tests | 63 passing |
| TypeScript | strict, 0 errors |
| ESLint | 0 warnings |
