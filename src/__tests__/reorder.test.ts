/**
 * 재주문 로직 테스트
 * 주문 아이템을 기반으로 장바구니에 상품을 다시 담는 로직을 검증합니다.
 */
import { useCartStore } from "@/store/cart-store";
import type { Product, OrderItem } from "@/types";

const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "프리미엄 원두",
    category: "식자재",
    price_per_unit: 5000,
    price_per_box: 45000,
    moq: 1,
    image_url: "",
    created_at: "2026-01-01",
  },
  {
    id: "prod-2",
    name: "테이크아웃 컵",
    category: "소모품",
    price_per_unit: 100,
    price_per_box: 8000,
    moq: 5,
    image_url: "",
    created_at: "2026-01-01",
  },
];

const mockOrderItems: OrderItem[] = [
  { product_id: "prod-1", name: "프리미엄 원두", quantity: 3, unit_price: 45000 },
  { product_id: "prod-2", name: "테이크아웃 컵", quantity: 5, unit_price: 8000 },
];

describe("재주문 로직", () => {
  beforeEach(() => {
    useCartStore.getState().clear();
  });

  it("주문 아이템의 상품을 장바구니에 추가한다", () => {
    // 재주문 로직 시뮬레이션: 상품 정보 + 주문 수량으로 addItem
    mockOrderItems.forEach((orderItem, i) => {
      useCartStore.getState().addItem(mockProducts[i], orderItem.quantity);
    });

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(2);
    expect(items[0].product.id).toBe("prod-1");
    expect(items[0].quantity).toBe(3);
    expect(items[1].product.id).toBe("prod-2");
    expect(items[1].quantity).toBe(5);
  });

  it("이미 장바구니에 있는 상품을 재주문하면 수량이 합산된다", () => {
    // 기존에 원두 2박스가 있는 상태
    useCartStore.getState().addItem(mockProducts[0], 2);

    // 재주문으로 원두 3박스 추가
    useCartStore.getState().addItem(mockProducts[0], 3);

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(5); // 2 + 3
  });

  it("재주문 후 총 금액이 올바르다", () => {
    mockOrderItems.forEach((orderItem, i) => {
      useCartStore.getState().addItem(mockProducts[i], orderItem.quantity);
    });

    // 45000 * 3 + 8000 * 5 = 135000 + 40000 = 175000
    expect(useCartStore.getState().totalAmount()).toBe(175000);
  });
});
