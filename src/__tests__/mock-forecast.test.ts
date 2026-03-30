import { generateMockForecast } from "@/lib/mock/forecast";

describe("generateMockForecast", () => {
  it("ForecastResponse 구조를 반환한다", () => {
    const result = generateMockForecast("카페/베이커리");
    expect(result.business_type).toBe("카페/베이커리");
    expect(result.period).toBe("4주");
    expect(result.generated_at).toBeDefined();
    expect(Array.isArray(result.forecasts)).toBe(true);
  });

  it("6개의 상품 예측을 반환한다", () => {
    const result = generateMockForecast("카페/베이커리");
    expect(result.forecasts.length).toBe(6);
  });

  it("각 상품에 4주치 forecast 데이터가 있다", () => {
    const result = generateMockForecast("카페/베이커리");
    result.forecasts.forEach((f) => {
      expect(f.forecast.length).toBe(4);
      f.forecast.forEach((dp) => {
        expect(dp.week_label).toBeDefined();
        expect(dp.predicted_orders).toBeGreaterThan(0);
        expect(dp.confidence_low).toBeLessThanOrEqual(dp.predicted_orders);
        expect(dp.confidence_high).toBeGreaterThanOrEqual(dp.predicted_orders);
      });
    });
  });

  it("trend는 rising/stable/declining 중 하나", () => {
    const result = generateMockForecast("식당/외식업");
    result.forecasts.forEach((f) => {
      expect(["rising", "stable", "declining"]).toContain(f.trend);
    });
  });

  it("change_percent가 숫자다", () => {
    const result = generateMockForecast("카페/베이커리");
    result.forecasts.forEach((f) => {
      expect(typeof f.change_percent).toBe("number");
    });
  });
});
