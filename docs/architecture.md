# architecture.md — 프로젝트 구조 한눈에 보기

> 기술 스택, 폴더 구조, 주요 컴포넌트, 스토어, 훅을 한 곳에 정리했습니다.

---

## 기술 스택

| 구분 | 기술 | 왜 썼나 |
|------|------|---------|
| 프레임워크 | Next.js 14 (App Router) | 파일 기반 라우팅, SSR/SSG 지원 |
| 언어 | TypeScript (strict) | 타입 안전성 |
| 스타일링 | Tailwind CSS + shadcn/ui | 유틸리티 클래스 + 재사용 컴포넌트 |
| 애니메이션 | Framer Motion | 선언적 애니메이션, AnimatePresence |
| 서버 상태 | TanStack Query (React Query) | 캐싱, 자동 리페치, 로딩/에러 상태 관리 |
| 클라이언트 상태 | Zustand | 간단한 전역 상태 (인증, 장바구니) |
| HTTP 클라이언트 | Axios | 인터셉터로 토큰 자동 주입, 401 처리 |
| 아이콘 | Lucide React | 트리셰이킹 가능한 아이콘 |

---

## 폴더 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   ├── layout.tsx          # 루트 레이아웃 (폰트, Provider, AuthHydrator)
│   ├── page.tsx            # 홈 (/)
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── products/
│   │   ├── page.tsx        # 상품 목록
│   │   └── [id]/page.tsx   # 상품 상세
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── orders/
│   │   ├── page.tsx        # 주문 내역
│   │   └── [id]/page.tsx   # 배송 조회
│   ├── trend/
│   │   ├── page.tsx        # 트렌드 리포트
│   │   └── best/page.tsx   # 업종별 베스트셀러
│   └── mypage/
│       ├── page.tsx        # 마이페이지
│       └── subscription/page.tsx
├── components/
│   ├── header.tsx          # 공통 헤더 (네비게이션, 장바구니, 인증)
│   ├── product-card.tsx    # 상품 카드 (목록/홈에서 사용)
│   ├── auth-hydrator.tsx   # 인증 상태 복원 래퍼
│   └── ui/                 # shadcn/ui 기본 컴포넌트
│       ├── button.tsx
│       ├── input.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       └── tabs.tsx
├── lib/
│   ├── api.ts              # Axios 인스턴스 (인터셉터, 토큰, 401 처리)
│   ├── auth.ts             # localStorage/cookie 토큰 관리 유틸
│   ├── queries.ts          # TanStack Query 커스텀 훅 모음
│   ├── product-visuals.ts  # 카테고리별 이모지/그라데이션 매핑
│   ├── query-provider.tsx  # React Query Provider 설정
│   └── utils.ts            # cn() 클래스 머지 유틸
├── store/
│   ├── auth-store.ts       # Zustand 인증 스토어
│   └── cart-store.ts       # Zustand 장바구니 스토어 (persist)
└── types/
    └── index.ts            # 공통 TypeScript 타입 정의
```

---

## 주요 컴포넌트

### Header (`src/components/header.tsx`)
- 모든 페이지 상단에 표시 (로그인/회원가입 제외)
- 스크롤 10px 이상 시 그림자 추가
- 모바일: 햄버거 메뉴
- 인증 상태에 따라 우측 영역 변경:
  - 로그인 전: "로그인" 버튼
  - 로그인 후: 장바구니 아이콘(뱃지) + 유저 아바타

### ProductCard (`src/components/product-card.tsx`)
- 상품 목록, 홈 추천상품에서 사용
- 카테고리별 이모지 + 그라데이션 배경
- "담기" 버튼 클릭 → 1.5초간 "담았습니다" 표시 후 복원
- 가격: 단가(취소선) + 박스가격(굵게)

### AuthHydrator (`src/components/auth-hydrator.tsx`)
- 앱 마운트 시 localStorage에서 인증 상태 복원
- `layout.tsx`에서 QueryProvider 안에 감싸서 사용

---

## Zustand 스토어

### useAuthStore (`src/store/auth-store.ts`)
```
상태: { user, token, isAuthenticated }
메서드: login(), logout(), hydrate(), updateUser()
저장: localStorage (수동 hydrate)
```
- `hydrate()`: AuthHydrator에서 앱 시작 시 호출
- `login()`: 토큰+유저를 localStorage에 저장하고 상태 갱신
- `logout()`: localStorage 비우고 상태 초기화

### useCartStore (`src/store/cart-store.ts`)
```
상태: { items }
메서드: addItem(), removeItem(), updateQuantity(), clear(), totalAmount(), totalCount()
저장: localStorage "bizmart-cart" (Zustand persist 미들웨어)
```
- `addItem()`: 이미 있는 상품이면 수량만 증가
- `updateQuantity()`: 수량 0 이하면 자동 삭제
- `clear()`: 결제 완료 후 호출

---

## TanStack Query 커스텀 훅 (`src/lib/queries.ts`)

| 훅 | 메서드 | 엔드포인트 | 사용 페이지 |
|----|--------|-----------|------------|
| `useLogin()` | POST | `/auth/login` | 로그인 |
| `useRegister()` | POST | `/auth/register` | 회원가입 |
| `useLogout()` | POST | `/auth/logout` | 마이페이지 |
| `useMe()` | GET | `/users/me` | 마이페이지 |
| `useUpdateMe()` | PATCH | `/users/me` | 마이페이지 (미연결) |
| `useProducts(params)` | GET | `/products` | 홈, 상품목록 |
| `useProduct(id)` | GET | `/products/:id` | 상품상세 |
| `useCreateOrder()` | POST | `/orders` | 결제 |
| `useOrders(status)` | GET | `/orders` | 주문내역 |
| `useOrder(id)` | GET | `/orders/:id` | 배송조회 |
| `useTrendReport(period, limit)` | GET | `/trend/report` | 홈, 트렌드 |
| `useBestSellers(type, limit)` | GET | `/trend/best` | 업종별 베스트셀러 |

### Query 설정 (`src/lib/query-provider.tsx`)
- staleTime: 60초 (데이터 신선도 유지 시간)
- retry: 3회 (지수 백오프, 최대 15초)
- refetchOnMount: true

---

## API 클라이언트 (`src/lib/api.ts`)

- Base URL: `NEXT_PUBLIC_API_URL` 환경변수 (기본값 `http://localhost:3001`)
- Timeout: 60초
- **Request 인터셉터**: localStorage에서 토큰 가져와 `Authorization: Bearer` 헤더에 자동 주입
- **Response 인터셉터**: `response.data`를 자동 언래핑해서 반환 / 401 에러 시 localStorage 비우고 `/login`으로 리다이렉트

---

## 디자인 토큰

### 컬러 (60-30-10 법칙)
| 비율 | 용도 | HEX |
|------|------|-----|
| 60% | 배경 | `#F8FAFC` + `#FFFFFF` |
| 30% | 주요 (헤더, 버튼) | `#1A3A6B` |
| 10% | 강조 (호버, 뱃지) | `#2563EB` |

### 폰트
- 영문: Plus Jakarta Sans
- 한국어: Noto Sans KR

### 카테고리 비주얼 (`src/lib/product-visuals.ts`)
| 카테고리 | 이모지 | 그라데이션 |
|---------|--------|-----------|
| 식자재 | 🍳 | orange → amber |
| 소모품 | 🧴 | blue → cyan |
| 포장재 | 📦 | yellow → orange |
| 뷰티용품 | 💄 | pink → rose |
| 인테리어 | 🪑 | emerald → green |
| 기타 | 📋 | gray → slate |

---

## 인증 흐름

```
앱 시작
  └─ AuthHydrator → useAuthStore.hydrate()
       └─ localStorage에서 token/user 복원

로그인
  └─ useLogin() 뮤테이션 → 성공 시 useAuthStore.login(token, user)
       └─ localStorage + cookie에 저장

API 호출
  └─ Axios request 인터셉터 → Bearer 토큰 자동 주입
       └─ 401 응답 → localStorage 비우고 /login 리다이렉트

로그아웃
  └─ useLogout() → useAuthStore.logout()
       └─ localStorage/cookie 비우고 /login 이동
```

---

## 애니메이션 패턴

이 프로젝트에서 자주 쓰이는 Framer Motion 패턴:

1. **stagger 자식 애니메이션**: 목록 아이템이 순서대로 등장 (`staggerChildren: 0.1`)
2. **AnimatePresence mode="wait"**: 탭 전환, 버튼 상태 변경 시 부드러운 전환
3. **layoutId**: 탭 활성 배경이 슬라이드하며 이동 (orders, trend/best, mypage)
4. **whileInView**: 스크롤 시 뷰포트 진입할 때 애니메이션 (홈 섹션들)
5. **popLayout**: 장바구니 아이템 삭제 시 부드러운 퇴장
6. **shimmer skeleton**: 로딩 중 CSS gradient 애니메이션
