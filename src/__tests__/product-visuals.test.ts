import { getCategoryVisual } from "@/lib/product-visuals";

describe("getCategoryVisual", () => {
  it("식자재 카테고리의 이모지와 그라데이션을 반환한다", () => {
    const visual = getCategoryVisual("식자재");
    expect(visual.emoji).toBe("🍳");
    expect(visual.gradient).toContain("orange");
  });

  it("소모품 카테고리의 이모지와 그라데이션을 반환한다", () => {
    const visual = getCategoryVisual("소모품");
    expect(visual.emoji).toBe("🧴");
    expect(visual.gradient).toContain("blue");
  });

  it("포장재 카테고리의 이모지와 그라데이션을 반환한다", () => {
    const visual = getCategoryVisual("포장재");
    expect(visual.emoji).toBe("📦");
    expect(visual.gradient).toContain("yellow");
  });

  it("뷰티용품 카테고리의 이모지와 그라데이션을 반환한다", () => {
    const visual = getCategoryVisual("뷰티용품");
    expect(visual.emoji).toBe("💄");
    expect(visual.gradient).toContain("pink");
  });

  it("인테리어 카테고리의 이모지와 그라데이션을 반환한다", () => {
    const visual = getCategoryVisual("인테리어");
    expect(visual.emoji).toBe("🪑");
    expect(visual.gradient).toContain("emerald");
  });

  it("기타 카테고리의 이모지와 그라데이션을 반환한다", () => {
    const visual = getCategoryVisual("기타");
    expect(visual.emoji).toBe("📋");
    expect(visual.gradient).toContain("gray");
  });

  it("알 수 없는 카테고리는 기본값을 반환한다", () => {
    const visual = getCategoryVisual("존재하지않는카테고리");
    expect(visual.emoji).toBe("📦");
    expect(visual.gradient).toContain("gray");
  });
});
