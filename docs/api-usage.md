# API_USAGE.md — bizmart-web
> 페이지별 사용 API 명세 | 백엔드 전체 명세는 bizmart-backend의 API_DOCS.md 참조

---

## 공통

**Base URL**
```
개발: http://localhost:3001
운영: https://bizmart-backend.onrender.com
```

**공통 헤더 (인증 필요 라우트)**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

---

## 로그인 `/login`

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/auth/login` | 이메일 + 비밀번호 로그인 |

```ts
POST /auth/login
{ "email": "test@bizmart.com", "password": "password123" }

// 응답
{ "access_token": "jwt_token", "user": { ... } }
```

---

## 회원가입 `/register`

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/auth/register` | 회원가입 |

```ts
POST /auth/register
{
  "email": "test@bizmart.com",
  "password": "password123",
  "business_number": "220-81-62517",
  "business_type": "카페/베이커리",
  "company_name": "하늘빛 카페",
  "owner_name": "김민준"
}
```

---

## 홈 `/`

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/products?sort=popular&limit=8` | 추천 상품 8개 |
| GET | `/trend/report?period=weekly&limit=3` | 이번 주 트렌드 TOP 3 |

---

## 상품 목록 `/products`

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/products` | 상품 목록 (필터/정렬/검색) |

**쿼리 파라미터**
```
category : 식자재 | 소모품 | 포장재 | 뷰티용품 | 인테리어 | 기타
sort     : latest | popular | price_asc | price_desc
search   : 검색어
page     : 페이지 번호 (default: 1)
limit    : 페이지당 개수 (default: 20)
```

---

## 상품 상세 `/products/[id]`

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/products/:id` | 상품 상세 정보 |

---

## 장바구니 `/cart`

> Zustand 로컬 상태로 관리 (API 없음)

```ts
// cartStore.ts
{
  items: CartItem[],
  addItem: (product, quantity) => void,
  removeItem: (productId) => void,
  updateQuantity: (productId, quantity) => void,
  clear: () => void
}
```

---

## 결제 `/checkout`

> Mock 결제 — 실제 PG 연동 없음

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/orders` | 주문 생성 + 즉시 결제 완료 처리 |

```ts
POST /orders
{
  "items": [
    { "product_id": "uuid", "quantity": 2 }
  ],
  "delivery_address": "서울시 마포구 합정동 123-45",
  "delivery_date": "2025-04-03",
  "is_cold": false
}

// 응답
{ "order_id": "BM-20250325-0063", "status": "주문완료", "total_amount": 130100 }
```

---

## 주문 내역 `/orders`

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/orders` | 내 주문 목록 |

---

## 배송 상태 `/orders/[id]`

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/orders/:id` | 주문 상세 + 배송 상태 |

---

## 트렌드 리포트 `/trend`

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/trend/report?period=weekly` | 주간 TOP 10 |
| GET | `/trend/report?period=monthly` | 월간 TOP 10 |

---

## 업종별 베스트셀러 `/trend/best`

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/trend/best?type=카페/베이커리` | 업종별 TOP 10 |

---

## 마이페이지 `/mypage`

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/users/me` | 내 정보 조회 |
| PATCH | `/users/me` | 사업자 정보 수정 |
| POST | `/auth/logout` | 로그아웃 |

---

## 정기구독 관리 `/mypage/subscription`

> UI만 구현 — 실제 빌링 없음, Zustand 로컬 상태만 사용
