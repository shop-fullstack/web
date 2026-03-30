# 전체 페이지 흐름도

> 사용자가 어디서 어디로 이동하는지, 인증이 필요한 페이지는 뭔지 한눈에 볼 수 있습니다.

---

## 페이지 목록

| 경로 | 페이지명 | 인증 필요 | 문서 |
|------|---------|----------|------|
| `/` | 홈 | - | [home.md](./home.md) |
| `/login` | 로그인 | - | [login.md](./login.md) |
| `/register` | 회원가입 | - | [register.md](./register.md) |
| `/products` | 상품 목록 | - | [products.md](./products.md) |
| `/products/[id]` | 상품 상세 | - | [product-detail.md](./product-detail.md) |
| `/cart` | 장바구니 | O | [cart.md](./cart.md) |
| `/checkout` | 결제 | O | [checkout.md](./checkout.md) |
| `/orders` | 주문 내역 | O | [orders.md](./orders.md) |
| `/orders/[id]` | 배송 조회 | O | [order-detail.md](./order-detail.md) |
| `/trend` | 트렌드 리포트 | O | [trend.md](./trend.md) |
| `/trend/best` | 업종별 베스트셀러 | O | [trend-best.md](./trend-best.md) |
| `/mypage` | 마이페이지 | O | [mypage.md](./mypage.md) |
| `/mypage/subscription` | 정기구독 관리 | O | [subscription.md](./subscription.md) |

---

## 네비게이션 흐름

```
┌─────────────────────────────────────────────────────────────────┐
│                        Header (공통)                            │
│  로고(→홈)  홈  상품  트렌드    장바구니🛒  로그인/아바타       │
└─────────────────────────────────────────────────────────────────┘

비로그인 사용자:
  홈(/) ──→ 상품목록(/products) ──→ 상품상세(/products/[id])
    │                                      │
    │                                      ├─ "담기" → 장바구니에 추가 (로그인 필요 X, 로컬 저장)
    │                                      └─ "바로 구매" → 장바구니(/cart)로 이동
    │
    ├──→ 카테고리 클릭 → 상품목록(/products?category=xxx)
    └──→ 로그인(/login) ←──→ 회원가입(/register)

로그인 사용자:
  홈(/) ──→ 상품목록 ──→ 상품상세 ──→ 장바구니(/cart)
                                           │
                                     결제(/checkout)
                                           │
                                     주문내역(/orders)
                                           │
                                     배송조회(/orders/[id])

  홈(/) ──→ 트렌드 리포트(/trend)
                 │
            업종별 베스트셀러(/trend/best)

  아바타 클릭 ──→ 마이페이지(/mypage)
                       │
                       ├─ 주문 내역(/orders)
                       └─ 정기구독 관리(/mypage/subscription)
                                │
                           "구독 추가" → 상품목록(/products)
```

---

## 쇼핑 플로우 (핵심 경로)

```
상품 발견 → 상세 확인 → 장바구니 담기 → 결제 → 주문 확인 → 배송 조회

/products → /products/[id] → /cart → /checkout → /orders → /orders/[id]
```

1. **상품 발견**: 홈 추천상품 or 상품목록에서 카테고리/검색으로 찾기
2. **상세 확인**: 가격, MOQ(최소주문수량), 원산지, 유통기한 확인
3. **장바구니**: Zustand 로컬 저장 (API 호출 없음), 수량 조절 가능
4. **결제**: Mock 결제 — 버튼 누르면 바로 주문 완료 (실제 PG 없음)
5. **주문 확인**: 상태별 필터 (전체/주문완료/배송중/배송완료)
6. **배송 조회**: 4단계 타임라인 UI (데모용, 실제 배송 연동 없음)

---

## 인증 흐름

```
비로그인 상태에서 보호된 페이지 접근 시:
  → API 401 응답 → Axios 인터셉터가 localStorage 비우고 /login으로 리다이렉트

로그인:
  /login → POST /auth/login → 토큰 저장 → 홈(/)으로 이동

회원가입:
  /register → POST /auth/register → 자동 로그인 → 홈(/)으로 이동

로그아웃:
  /mypage → POST /auth/logout → 상태 초기화 → /login으로 이동
```

---

## Header가 없는 페이지

- `/login` — 인증 전 페이지라 Header 불필요
- `/register` — 마찬가지

나머지 모든 페이지는 Header가 표시됩니다. Header는 각 페이지의 `page.tsx`에서 직접 `<Header />` 컴포넌트를 넣어서 사용합니다 (layout.tsx에는 없음).
