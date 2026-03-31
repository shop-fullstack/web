"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { getCategoryVisual } from "@/lib/product-visuals";
import { useCartStore } from "@/store/cart-store";
import type { ChatMessage as ChatMessageType } from "@/types";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";
  const addItem = useCartStore((s) => s.addItem);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[85%] flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
        {/* Bubble */}
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "rounded-br-md bg-primary-700 text-white"
              : "rounded-bl-md bg-white text-gray-800 border border-gray-100 shadow-sm"
          }`}
        >
          {message.content}
        </div>

        {/* Inline Product Cards */}
        {message.products && message.products.length > 0 && (
          <div className="flex flex-col gap-2 w-full">
            {message.products.map((product) => {
              const v = getCategoryVisual(product.category);
              return (
                <div
                  key={product.id}
                  className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 p-2.5 shadow-sm"
                >
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${v.gradient}`}>
                    <span className="text-lg">{v.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-primary-600 font-medium">{product.price_per_box.toLocaleString()}원</p>
                  </div>
                  <button
                    onClick={() => addItem(product, 1)}
                    aria-label={`${product.name} 장바구니에 담기`}
                    className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors"
                  >
                    <ShoppingBag size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Button */}
        {message.action && (
          <Link
            href={message.action.payload}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 border border-primary-200 px-3.5 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100 transition-all"
          >
            {message.action.label} →
          </Link>
        )}
      </div>
    </motion.div>
  );
}
