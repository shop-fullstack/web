# backend-api-requirements.md — 백엔드 필요 API 명세

> 프론트엔드에서 호출하는 모든 API 엔드포인트와 요청/응답 스키마를 정리한 문서입니다.
> 현재 Mock으로 동작하는 Phase 3 API도 포함합니다.

---

## 공통

**Base URL:** `NEXT_PUBLIC_API_URL` 환경변수 (기본값 `http://localhost:3001`)

**인증 헤더 (로그인 필요 라우트):**
```
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**공통 응답 래퍼:**
```ts
{
  "statusCode": number,
  "message": string,
  "data": T
}
```

---

## 1. 인증 (Auth)

### POST `/auth/register` — 회원가입

**요청:**
```json
{
  "email": "test@bizmart.com",
  "password": "password123",
  "business_number": "220-81-62517",
  "business_type": "카페/베이커리",
  "company_name": "하늘빛 카페",
  "owner_name": "김민준"
}
```

**응답:**
```json
{
  "statusCode": 201,
  "message": "회원가입 성공",
  "data": {
    "access_token": "jwt_token_here",
    "user": {
      "id": "uuid",
      "email": "test@bizmart.com",
      "business_number": "220-81-62517",
      "business_type": "카페/베이커리",
      "company_name": "하늘빛 카페",
      "owner_name": "김민준",
      "grade": "일반회원",
      "created_at": "2026-01-01T00:00:00Z"
    }
  }
}
```

### POST `/auth/login` — 로그인

**요청:**
```json
{
  "email": "test@bizmart.com",
  "password": "password123"
}
```

**응답:** 회원가입과 동일한 구조 (`access_token` + `user`)

### POST `/auth/logout` — 로그아웃

**헤더:** Authorization 필요

**응답:** `{ "statusCode": 200, "message": "로그아웃 성공", "data": null }`

---

## 2. 사용자 (Users)

### GET `/users/me` — 내 정보 조회

**헤더:** Authorization 필요

**응답 `data`:**
```ts
{
  "id": string,
  "email": string,
  "business_number": string,
  "business_type": string,       // "카페/베이커리" | "식당/외식업" | "미용실/뷰티" | "편의점/소매업" | "네일샵/피부샵"
  "company_name": string,
  "owner_name": string,
  "grade": string,               // "일반회원" | "프리미엄"
  "created_at": string           // ISO 8601
}
```

### PATCH `/users/me` — 사업자 정보 수정

**헤더:** Authorization 필요

**요청 (부분 업데이트):**
```json
{
  "business_number": "220-81-62517",
  "business_type": "식당/외식업",
  "company_name": "변경된 상호명",
  "owner_name": "김민준"
}
```

**응답 `data`:** 수정된 User 객체

---

## 3. 상품 (Products)

### GET `/products` — 상품 목록

**쿼리 파라미터:**
| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|--------|------|
| `category` | string | - | 식자재, 소모품, 포장재, 뷰티용품, 인테리어, 기타 |
| `sort` | string | `popular` | popular, price_asc, price_desc, latest |
| `search` | string | - | 상품명 검색어 |
| `page` | number | 1 | 페이지 번호 |
| `limit` | number | 20 | 페이지당 개수 |

**응답 `data`:**
```ts
{
  "items": Product[],
  "total": number,
  "page": number,
  "limit": number
}
```

### GET `/products/:id` — 상품 상세

**응답 `data`:**
```ts
{
  "id": string,
  "name": string,
  "category": string,
  "price_per_unit": number,
  "price_per_box": number,
  "moq": number,
  "image_url": string,
  "origin"?: string,
  "expiry_info"?: string,
  "created_at": string
}
```

---

## 4. 주문 (Orders)

### POST `/orders` — 주문 생성

**헤더:** Authorization 필요

**요청:**
```json
{
  "items": [
    { "product_id": "uuid", "quantity": 2 }
  ],
  "delivery_address": "서울특별시 마포구 합정동 123-45",
  "delivery_date": "2026-04-05",
  "is_cold": false
}
```

**응답 `data`:**
```ts
{
  "order_id": string,   // "BM-20260325-0063"
  "total_amount": number,
  "status": string      // "주문완료"
}
```

### GET `/orders` — 주문 목록

**헤더:** Authorization 필요

**쿼리 파라미터:**
| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `status` | string | 주문완료, 배송준비, 배송중, 배송완료 (없으면 전체) |

**응답 `data`:** `Order[]`

```ts
Order = {
  "id": string,
  "status": "주문완료" | "배송준비" | "배송중" | "배송완료",
  "total_amount": number,
  "delivery_address": string,
  "delivery_date": string,
  "is_cold": boolean,
  "items": [
    {
      "product_id": string,
      "name": string,
      "quantity": number,
      "unit_price": number
    }
  ],
  "created_at": string
}
```

### GET `/orders/:id` — 주문 상세

**헤더:** Authorization 필요

**응답 `data`:** 단일 `Order` 객체

---

## 5. 트렌드 (Trend)

### GET `/trend/report` — 트렌드 리포트

**쿼리 파라미터:**
| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `period` | string | `weekly` 또는 `monthly` |
| `limit` | number | 반환할 순위 개수 (기본 10) |

**응답 `data`:**
```ts
{
  "period": "weekly" | "monthly",
  "generated_at": string,
  "ranking": [
    {
      "rank": number,
      "product_id": string,
      "name": string,
      "category": string,
      "order_count": number,
      "change": "up" | "down" | "same" | "new"
    }
  ]
}
```

### GET `/trend/best` — 업종별 베스트셀러

**쿼리 파라미터:**
| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `type` | string | 업종명 (예: "카페/베이커리") |
| `limit` | number | 반환할 순위 개수 (기본 10) |

**응답 `data`:**
```ts
{
  "business_type": string,
  "ranking": TrendRankItem[]  // 위와 동일한 구조
}
```

---

## 6. 개인화 추천 (Recommend) — ⚡ Phase 3 신규

> 현재 프론트에서 Mock으로 동작 중. 백엔드 구현 시 아래 스펙으로 만들면 자동 전환됩니다.

### GET `/recommend` — AI 맞춤 추천

**헤더:** Authorization 필요

**쿼리 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `business_type` | string | O | 사용자 업종 (예: "카페/베이커리") |

**응답 `data`:**
```ts
{
  "user_business_type": string,
  "items": [
    {
      "product": Product,          // 기존 Product 스키마와 동일
      "reason": string,            // 한글 추천 이유 (예: "업종 인기 상품")
      "score": number,             // 0~100 (추천 점수, 높을수록 관련도 높음)
      "reason_type": "business_type" | "order_history" | "trending" | "similar"
    }
  ],
  "generated_at": string
}
```

**추천 로직 가이드:**
- `business_type`: 해당 업종에서 많이 주문한 상품 → score 75~100
- `trending`: 최근 트렌드 상승 상품 → score 60~90
- `order_history`: 사용자의 과거 주문과 같은 카테고리 → score 50~85
- `similar`: 나머지 상품 → score 30~60
- score 내림차순 정렬, 최대 8개 반환

---

## 7. 수요 예측 (Forecast) — ⚡ Phase 3 신규

> 현재 프론트에서 Mock으로 동작 중. 백엔드 구현 시 아래 스펙으로 만들면 자동 전환됩니다.

### GET `/forecast` — 수요 예측 데이터

**헤더:** Authorization 필요

**쿼리 파라미터:**
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `business_type` | string | O | 사용자 업종 |

**응답 `data`:**
```ts
{
  "business_type": string,
  "period": "4주",
  "forecasts": [
    {
      "product_id": string,
      "product_name": string,
      "category": string,
      "current_weekly_avg": number,     // 최근 주간 평균 주문 수
      "forecast": [
        {
          "week_label": string,         // "4/1~4/7" 형식
          "predicted_orders": number,   // 예측 주문 수
          "confidence_low": number,     // 신뢰구간 하한
          "confidence_high": number     // 신뢰구간 상한
        }
      ],                               // 4개 (4주)
      "trend": "rising" | "stable" | "declining",
      "change_percent": number          // 주차 대비 변화율 (%)
    }
  ],                                    // 6개 상품
  "generated_at": string
}
```

**예측 로직 가이드:**
- 최근 4주 주문 데이터 + 계절성 패턴 기반
- `confidence_low` ≤ `predicted_orders` ≤ `confidence_high`
- `trend` 판정: change_percent > 5% → rising, < -5% → declining, 나머지 → stable
- 업종별로 자주 주문하는 상품 6개를 선정하여 예측

---

## 8. AI 챗봇 (Chat) — ⚡ Phase 3 (선택 사항)

> 현재 프론트에서 패턴 매칭 Mock으로 동작. 백엔드에 LLM 연동 시 아래 스펙 사용.

### POST `/chat` — 챗봇 대화 (선택 구현)

**헤더:** Authorization 필요

**요청:**
```json
{
  "message": "추천해줘",
  "context": {
    "business_type": "카페/베이커리",
    "cart_count": 3
  }
}
```

**응답 `data`:**
```ts
{
  "id": string,
  "role": "assistant",
  "content": string,              // 응답 텍스트
  "timestamp": string,
  "products"?: Product[],         // 인라인 표시할 상품 (선택)
  "action"?: {
    "type": "view_product" | "add_to_cart" | "view_order" | "view_trend",
    "label": string,              // 버튼 텍스트
    "payload": string             // 이동할 경로 또는 상품 ID
  }
}
```

> 이 API는 선택 사항입니다. 구현하지 않아도 프론트의 Mock 엔진이 동작합니다.

---

## 업종 코드 목록

프론트엔드에서 사용하는 업종명 (하드코딩):

| 코드 | 설명 |
|------|------|
| `카페/베이커리` | 카페, 빵집 |
| `식당/외식업` | 식당, 레스토랑 |
| `미용실/뷰티` | 미용실, 뷰티샵 |
| `편의점/소매업` | 편의점, 마트 |
| `네일샵/피부샵` | 네일, 피부관리 |

---

## 카테고리 목록

| 카테고리 |
|---------|
| 식자재 |
| 소모품 |
| 포장재 |
| 뷰티용품 |
| 인테리어 |
| 기타 |

---

## 구현 우선순위

| 순위 | API | 상태 | 비고 |
|------|-----|------|------|
| 1 | auth (register/login/logout) | ✅ 구현됨 | |
| 2 | users/me (GET/PATCH) | ✅ 구현됨 | |
| 3 | products (목록/상세) | ✅ 구현됨 | |
| 4 | orders (생성/목록/상세) | ✅ 구현됨 | |
| 5 | trend (report/best) | ✅ 구현됨 | |
| 6 | **recommend** | 🔲 미구현 | Mock 전환 중 |
| 7 | **forecast** | 🔲 미구현 | Mock 전환 중 |
| 8 | **chat** | 🔲 선택 | Mock으로 충분, LLM 연동 시 구현 |
