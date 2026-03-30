# BizMart — 소상공인을 위한 B2B 쇼핑몰

소상공인(카페, 식당, 미용실 등) 대상 **AI 트렌드 인사이트 + B2B 종합 도매 플랫폼** 프론트엔드입니다.

## 주요 기능

- 상품 목록 / 상세 / 카테고리 필터 / 검색
- 장바구니 + Mock 결제 (실제 PG 없음)
- 주문 내역 / 배송 상태 UI
- 트렌드 리포트 대시보드
- 업종별 베스트셀러
- 마이페이지 / 정기구독 관리 (UI)

## 기술 스택

Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion · Zustand · TanStack Query · Axios

## 로컬 실행

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:3001

# 개발 서버
npm run dev
```

http://localhost:3000 에서 확인

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run lint` | ESLint 실행 |
| `npx tsc --noEmit` | 타입 체크 |

## 문서

자세한 문서는 [`docs/`](./docs/README.md) 폴더를 확인하세요.

- [프로젝트 구조](./docs/architecture.md) — 기술 스택, 폴더 구조, 컴포넌트
- [페이지별 인수인계](./docs/pages/_overview.md) — 네비게이션 흐름 + 페이지별 상세
- [API 명세](./docs/api-usage.md) — 페이지별 API 호출
- [기획서](./docs/planning.md) — 기능 명세, UI/UX 시스템, 로드맵
- [변경 이력](./docs/changelog.md) — 버전별 변경 사항
