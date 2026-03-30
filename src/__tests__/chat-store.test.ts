import { useChatStore } from "@/store/chat-store";
import type { ChatMessage } from "@/types";

const mockMessage: ChatMessage = {
  id: "msg-1",
  role: "user",
  content: "안녕하세요",
  timestamp: new Date().toISOString(),
};

const mockAssistantMessage: ChatMessage = {
  id: "msg-2",
  role: "assistant",
  content: "안녕하세요! 무엇을 도와드릴까요?",
  timestamp: new Date().toISOString(),
};

describe("useChatStore", () => {
  beforeEach(() => {
    useChatStore.getState().clearMessages();
    useChatStore.setState({ isOpen: false, isTyping: false });
  });

  it("addMessage: 메시지를 추가한다", () => {
    useChatStore.getState().addMessage(mockMessage);
    expect(useChatStore.getState().messages).toHaveLength(1);
    expect(useChatStore.getState().messages[0].content).toBe("안녕하세요");
  });

  it("addMessage: 여러 메시지를 순서대로 추가한다", () => {
    useChatStore.getState().addMessage(mockMessage);
    useChatStore.getState().addMessage(mockAssistantMessage);
    expect(useChatStore.getState().messages).toHaveLength(2);
    expect(useChatStore.getState().messages[0].role).toBe("user");
    expect(useChatStore.getState().messages[1].role).toBe("assistant");
  });

  it("toggleOpen: 열림/닫힘 토글한다", () => {
    expect(useChatStore.getState().isOpen).toBe(false);
    useChatStore.getState().toggleOpen();
    expect(useChatStore.getState().isOpen).toBe(true);
    useChatStore.getState().toggleOpen();
    expect(useChatStore.getState().isOpen).toBe(false);
  });

  it("setTyping: 타이핑 상태를 변경한다", () => {
    useChatStore.getState().setTyping(true);
    expect(useChatStore.getState().isTyping).toBe(true);
    useChatStore.getState().setTyping(false);
    expect(useChatStore.getState().isTyping).toBe(false);
  });

  it("clearMessages: 메시지를 전부 비운다", () => {
    useChatStore.getState().addMessage(mockMessage);
    useChatStore.getState().addMessage(mockAssistantMessage);
    useChatStore.getState().clearMessages();
    expect(useChatStore.getState().messages).toHaveLength(0);
  });
});
