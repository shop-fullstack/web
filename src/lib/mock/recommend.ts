import type { Product, RecommendationItem, RecommendationResponse } from "@/types";

const MOCK_PRODUCTS: Product[] = [
  { id: "rec-1", name: "프리미엄 원두 1kg", category: "식자재", price_per_unit: 15000, price_per_box: 45000, moq: 3, image_url: "", created_at: "2026-01-01" },
  { id: "rec-2", name: "테이크아웃 컵 500개", category: "소모품", price_per_unit: 80, price_per_box: 12000, moq: 5, image_url: "", created_at: "2026-01-01" },
  { id: "rec-3", name: "친환경 종이백 300장", category: "포장재", price_per_unit: 120, price_per_box: 9500, moq: 3, image_url: "", created_at: "2026-01-01" },
  { id: "rec-4", name: "에스프레소 시럽 세트", category: "식자재", price_per_unit: 8000, price_per_box: 32000, moq: 2, image_url: "", created_at: "2026-01-01" },
  { id: "rec-5", name: "업소용 물티슈 100팩", category: "소모품", price_per_unit: 500, price_per_box: 18000, moq: 2, image_url: "", created_at: "2026-01-01" },
  { id: "rec-6", name: "프리미엄 헤어 에센스", category: "뷰티용품", price_per_unit: 12000, price_per_box: 96000, moq: 1, image_url: "", created_at: "2026-01-01" },
  { id: "rec-7", name: "미니 디퓨저 세트", category: "인테리어", price_per_unit: 5000, price_per_box: 25000, moq: 2, image_url: "", created_at: "2026-01-01" },
  { id: "rec-8", name: "일회용 앞치마 200장", category: "소모품", price_per_unit: 200, price_per_box: 8000, moq: 3, image_url: "", created_at: "2026-01-01" },
  { id: "rec-9", name: "수제 쿠키 믹스 5kg", category: "식자재", price_per_unit: 18000, price_per_box: 54000, moq: 2, image_url: "", created_at: "2026-01-01" },
  { id: "rec-10", name: "네일 젤 폴리시 세트", category: "뷰티용품", price_per_unit: 3000, price_per_box: 36000, moq: 1, image_url: "", created_at: "2026-01-01" },
];

const BUSINESS_CATEGORY_MAP: Record<string, string[]> = {
  "카페/베이커리": ["식자재", "소모품", "포장재"],
  "식당/외식업": ["식자재", "소모품", "포장재"],
  "미용실/뷰티": ["뷰티용품", "소모품", "인테리어"],
  "편의점/소매업": ["식자재", "소모품", "포장재"],
  "네일샵/피부샵": ["뷰티용품", "소모품", "인테리어"],
};

const REASON_MAP: Record<RecommendationItem["reason_type"], string[]> = {
  business_type: ["업종 인기 상품", "같은 업종 사장님들이 많이 주문", "업종 맞춤 추천"],
  trending: ["이번 주 트렌드 상승", "주문 급증 중", "인기 급상승 상품"],
  order_history: ["이전 구매와 유사", "재주문 추천", "구매 패턴 기반 추천"],
  similar: ["비슷한 상품 추천", "함께 많이 구매하는 상품", "연관 상품"],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateMockRecommendations(businessType: string): RecommendationResponse {
  const relevantCategories = BUSINESS_CATEGORY_MAP[businessType] || ["식자재", "소모품"];
  const items: RecommendationItem[] = [];

  MOCK_PRODUCTS.forEach((product) => {
    const isRelevant = relevantCategories.includes(product.category);
    let reasonType: RecommendationItem["reason_type"];
    let baseScore: number;

    if (isRelevant) {
      const roll = Math.random();
      if (roll < 0.4) {
        reasonType = "business_type";
        baseScore = 75 + Math.floor(Math.random() * 25);
      } else if (roll < 0.7) {
        reasonType = "trending";
        baseScore = 60 + Math.floor(Math.random() * 30);
      } else {
        reasonType = "order_history";
        baseScore = 50 + Math.floor(Math.random() * 35);
      }
    } else {
      reasonType = "similar";
      baseScore = 30 + Math.floor(Math.random() * 30);
    }

    items.push({
      product,
      reason: pickRandom(REASON_MAP[reasonType]),
      score: Math.min(baseScore, 100),
      reason_type: reasonType,
    });
  });

  items.sort((a, b) => b.score - a.score);

  return {
    user_business_type: businessType,
    items: items.slice(0, 8),
    generated_at: new Date().toISOString(),
  };
}
