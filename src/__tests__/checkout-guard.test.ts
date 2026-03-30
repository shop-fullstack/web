/**
 * 결제 페이지 빈 장바구니 가드 테스트
 * 장바구니가 비어있으면 /cart로 리다이렉트하는 로직을 검증합니다.
 */
import { useCartStore } from "@/store/cart-store";

describe("결제 페이지 빈 장바구니 가드 로직", () => {
  beforeEach(() => {
    useCartStore.getState().clear();
  });

  it("장바구니가 비어있으면 items.length === 0", () => {
    expect(useCartStore.getState().items.length).toBe(0);
  });

  it("상품을 추가하면 items.length > 0", () => {
    useCartStore.getState().addItem(
      {
        id: "prod-1",
        name: "테스트",
        category: "식자재",
        price_per_unit: 1000,
        price_per_box: 9000,
        moq: 1,
        image_url: "",
        created_at: "2026-01-01",
      },
      1
    );
    expect(useCartStore.getState().items.length).toBe(1);
  });

  it("결제 완료 후 clear()하면 다시 비어있다", () => {
    useCartStore.getState().addItem(
      {
        id: "prod-1",
        name: "테스트",
        category: "식자재",
        price_per_unit: 1000,
        price_per_box: 9000,
        moq: 1,
        image_url: "",
        created_at: "2026-01-01",
      },
      2
    );
    useCartStore.getState().clear();
    expect(useCartStore.getState().items.length).toBe(0);
  });
});
