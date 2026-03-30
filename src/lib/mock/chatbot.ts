import type { ChatMessage, Product } from "@/types";

const MOCK_PRODUCTS: Product[] = [
  { id: "chat-1", name: "프리미엄 원두 1kg", category: "식자재", price_per_unit: 15000, price_per_box: 45000, moq: 3, image_url: "", created_at: "2026-01-01" },
  { id: "chat-2", name: "테이크아웃 컵 500개", category: "소모품", price_per_unit: 80, price_per_box: 12000, moq: 5, image_url: "", created_at: "2026-01-01" },
  { id: "chat-3", name: "친환경 종이백 300장", category: "포장재", price_per_unit: 120, price_per_box: 9500, moq: 3, image_url: "", created_at: "2026-01-01" },
];

function makeId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function makeMessage(
  content: string,
  options?: { products?: Product[]; action?: ChatMessage["action"] }
): ChatMessage {
  return {
    id: makeId(),
    role: "assistant",
    content,
    timestamp: new Date().toISOString(),
    ...(options?.products && { products: options.products }),
    ...(options?.action && { action: options.action }),
  };
}

type Intent = "greeting" | "recommend" | "order" | "trend" | "price" | "search" | "fallback";

function detectIntent(message: string): Intent {
  const m = message.toLowerCase();
  if (/안녕|ㅎㅇ|하이|hello|hi/.test(m)) return "greeting";
  if (/추천|뭐 ?살|뭐 ?좋|골라/.test(m)) return "recommend";
  if (/주문|배송|내 ?주문|order/.test(m)) return "order";
  if (/트렌드|인기|요즘|핫/.test(m)) return "trend";
  if (/가격|얼마|비용|price/.test(m)) return "price";
  if (/찾아|검색|있어|어디/.test(m)) return "search";
  return "fallback";
}

export async function generateChatResponse(message: string): Promise<ChatMessage> {
  // Simulate typing delay
  await new Promise((r) => setTimeout(r, 300));

  const intent = detectIntent(message);

  switch (intent) {
    case "greeting":
      return makeMessage(
        "안녕하세요! 비즈마트 AI 어시스턴트입니다 😊\n상품 추천, 주문 확인, 트렌드 분석 등을 도와드릴 수 있어요. 무엇이 궁금하세요?"
      );

    case "recommend":
      return makeMessage(
        "회원님의 업종에 맞는 인기 상품을 추천드릴게요! 아래 상품들이 요즘 많이 주문되고 있어요.",
        {
          products: MOCK_PRODUCTS,
          action: { type: "view_product", label: "AI 추천 더보기", payload: "/recommend" },
        }
      );

    case "order":
      return makeMessage(
        "주문 내역을 확인하시려면 아래 버튼을 눌러주세요. 최근 주문 상태를 한눈에 볼 수 있어요!",
        { action: { type: "view_order", label: "주문 내역 보기", payload: "/orders" } }
      );

    case "trend":
      return makeMessage(
        "이번 주 트렌드를 분석해봤어요! 트렌드 리포트에서 인기 상품과 업종별 베스트셀러를 확인해보세요.",
        { action: { type: "view_trend", label: "트렌드 보기", payload: "/trend" } }
      );

    case "price":
      return makeMessage(
        "상품 가격이 궁금하시군요! 인기 상품 가격을 알려드릴게요.\n\n• 프리미엄 원두 1kg: 박스 45,000원\n• 테이크아웃 컵 500개: 박스 12,000원\n• 친환경 종이백 300장: 박스 9,500원",
        { products: MOCK_PRODUCTS }
      );

    case "search":
      return makeMessage(
        "상품을 찾고 계시군요! 아래에서 관련 상품을 확인해보세요.",
        {
          products: MOCK_PRODUCTS.slice(0, 2),
          action: { type: "view_product", label: "전체 상품 보기", payload: "/products" },
        }
      );

    case "fallback":
    default:
      return makeMessage(
        "죄송해요, 잘 이해하지 못했어요. 아래 기능을 이용해보세요!\n\n• \"추천해줘\" — AI 맞춤 상품 추천\n• \"주문 확인\" — 주문/배송 상태 확인\n• \"트렌드\" — 이번 주 인기 상품\n• \"OO 가격\" — 상품 가격 조회"
      );
  }
}
