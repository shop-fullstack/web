import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types";

const mockProduct: Product = {
  id: "prod-1",
  name: "테스트 원두",
  category: "식자재",
  price_per_unit: 5000,
  price_per_box: 45000,
  moq: 1,
  image_url: "",
  created_at: "2026-01-01",
};

const mockProduct2: Product = {
  id: "prod-2",
  name: "테이크아웃 컵",
  category: "소모품",
  price_per_unit: 100,
  price_per_box: 8000,
  moq: 5,
  image_url: "",
  created_at: "2026-01-01",
};

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.getState().clear();
  });

  it("addItem: 새 상품을 추가한다", () => {
    useCartStore.getState().addItem(mockProduct, 3);

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe("prod-1");
    expect(items[0].quantity).toBe(3);
  });

  it("addItem: 이미 있는 상품이면 수량만 증가한다", () => {
    useCartStore.getState().addItem(mockProduct, 2);
    useCartStore.getState().addItem(mockProduct, 3);

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(5);
  });

  it("removeItem: 상품을 제거한다", () => {
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().addItem(mockProduct2, 2);
    useCartStore.getState().removeItem("prod-1");

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe("prod-2");
  });

  it("updateQuantity: 수량을 변경한다", () => {
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().updateQuantity("prod-1", 10);

    expect(useCartStore.getState().items[0].quantity).toBe(10);
  });

  it("updateQuantity: 수량이 0 이하면 아이템을 삭제한다", () => {
    useCartStore.getState().addItem(mockProduct, 3);
    useCartStore.getState().updateQuantity("prod-1", 0);

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("clear: 장바구니를 비운다", () => {
    useCartStore.getState().addItem(mockProduct, 1);
    useCartStore.getState().addItem(mockProduct2, 2);
    useCartStore.getState().clear();

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("totalAmount: 총 금액을 계산한다", () => {
    useCartStore.getState().addItem(mockProduct, 2); // 45000 * 2 = 90000
    useCartStore.getState().addItem(mockProduct2, 3); // 8000 * 3 = 24000

    expect(useCartStore.getState().totalAmount()).toBe(114000);
  });

  it("totalCount: 총 수량을 계산한다", () => {
    useCartStore.getState().addItem(mockProduct, 2);
    useCartStore.getState().addItem(mockProduct2, 3);

    expect(useCartStore.getState().totalCount()).toBe(5);
  });
});
