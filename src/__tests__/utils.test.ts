import { cn } from "@/lib/utils";

describe("cn (class merge utility)", () => {
  it("여러 클래스를 합친다", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });

  it("조건부 클래스를 처리한다", () => {
    expect(cn("base", true && "active", false && "hidden")).toBe("base active");
  });

  it("Tailwind 충돌을 해결한다", () => {
    // twMerge: 뒤의 px-6이 px-4를 덮어씀
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  it("undefined/null을 무시한다", () => {
    expect(cn("base", undefined, null, "extra")).toBe("base extra");
  });

  it("빈 문자열을 무시한다", () => {
    expect(cn("base", "", "extra")).toBe("base extra");
  });
});
