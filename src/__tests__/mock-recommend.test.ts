import { generateMockRecommendations } from "@/lib/mock/recommend";

describe("generateMockRecommendations", () => {
  it("RecommendationResponse 구조를 반환한다", () => {
    const result = generateMockRecommendations("카페/베이커리");
    expect(result.user_business_type).toBe("카페/베이커리");
    expect(result.generated_at).toBeDefined();
    expect(Array.isArray(result.items)).toBe(true);
  });

  it("8개 이하의 추천 아이템을 반환한다", () => {
    const result = generateMockRecommendations("식당/외식업");
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.length).toBeLessThanOrEqual(8);
  });

  it("각 아이템에 product, reason, score, reason_type이 있다", () => {
    const result = generateMockRecommendations("카페/베이커리");
    result.items.forEach((item) => {
      expect(item.product).toBeDefined();
      expect(item.product.id).toBeDefined();
      expect(item.product.name).toBeDefined();
      expect(typeof item.reason).toBe("string");
      expect(item.score).toBeGreaterThanOrEqual(0);
      expect(item.score).toBeLessThanOrEqual(100);
      expect(["business_type", "order_history", "trending", "similar"]).toContain(
        item.reason_type
      );
    });
  });

  it("score 기준 내림차순으로 정렬되어 있다", () => {
    const result = generateMockRecommendations("카페/베이커리");
    for (let i = 1; i < result.items.length; i++) {
      expect(result.items[i - 1].score).toBeGreaterThanOrEqual(result.items[i].score);
    }
  });
});
