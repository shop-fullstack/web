import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage } from "@/types";

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  addMessage: (message: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  toggleOpen: () => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isOpen: false,
      isTyping: false,
      addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setTyping: (typing) => set({ isTyping: typing }),
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: "bizmart-chat",
      partialize: (state) => ({ messages: state.messages }),
    }
  )
);
