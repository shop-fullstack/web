import { generateChatResponse } from "@/lib/mock/chatbot";

describe("generateChatResponse", () => {
  it("ChatMessage 구조를 반환한다", async () => {
    const result = await generateChatResponse("안녕하세요");
    expect(result.id).toBeDefined();
    expect(result.role).toBe("assistant");
    expect(typeof result.content).toBe("string");
    expect(result.content.length).toBeGreaterThan(0);
    expect(result.timestamp).toBeDefined();
  });

  it("인사에 응답한다", async () => {
    const result = await generateChatResponse("안녕");
    expect(result.content).toContain("안녕");
  });

  it("추천 요청에 상품을 포함한다", async () => {
    const result = await generateChatResponse("추천해줘");
    expect(result.products).toBeDefined();
    expect(result.products!.length).toBeGreaterThan(0);
  });

  it("주문 관련 질문에 action을 포함한다", async () => {
    const result = await generateChatResponse("주문 확인해줘");
    expect(result.action).toBeDefined();
    expect(result.action!.type).toBe("view_order");
  });

  it("트렌드 질문에 action을 포함한다", async () => {
    const result = await generateChatResponse("요즘 트렌드가 뭐야");
    expect(result.action).toBeDefined();
    expect(result.action!.type).toBe("view_trend");
  });

  it("알 수 없는 입력에 fallback 응답을 반환한다", async () => {
    const result = await generateChatResponse("asdfjkl;");
    expect(result.content).toBeDefined();
    expect(result.content.length).toBeGreaterThan(0);
  });
});
