"use client";

import Link from "next/link";
import { Sparkles, ShoppingBag, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { getCategoryVisual } from "@/lib/product-visuals";
import type { RecommendationItem } from "@/types";

const BADGE_COLORS: Record<RecommendationItem["reason_type"], string> = {
  business_type: "from-violet-500 to-indigo-500",
  trending: "from-emerald-500 to-teal-500",
  order_history: "from-blue-500 to-cyan-500",
  similar: "from-amber-500 to-orange-500",
};

export function RecommendationCard({ item }: { item: RecommendationItem }) {
  const { product, reason, score, reason_type } = item;
  const visual = getCategoryVisual(product.category);
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-shadow"
    >
      {/* AI Reason Badge */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-1">
        <span
          className={`flex items-center gap-1 rounded-full bg-gradient-to-r ${BADGE_COLORS[reason_type]} px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm`}
        >
          <Sparkles size={10} />
          {reason}
        </span>
      </div>

      {/* Score Ring */}
      <div className="absolute right-3 top-3 z-10">
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="13" fill="white" stroke="#e5e7eb" strokeWidth="2" />
          <circle
            cx="16"
            cy="16"
            r="13"
            fill="none"
            stroke="url(#scoreGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 81.68} 81.68`}
            transform="rotate(-90 16 16)"
          />
          <defs>
            <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <text x="16" y="18" textAnchor="middle" fontSize="9" fontWeight="700" fill="#4b5563">
            {score}
          </text>
        </svg>
      </div>

      {/* Product Image */}
      <Link href={`/products/${product.id}`}>
        <div
          className={`flex h-[160px] items-center justify-center bg-gradient-to-br ${visual.gradient} transition-transform duration-300 group-hover:scale-[1.02]`}
        >
          <span className="text-[56px] drop-shadow-sm">{visual.emoji}</span>
        </div>
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <span className="inline-flex w-fit rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-medium text-primary-700">
          {product.category}
        </span>
        <Link href={`/products/${product.id}`}>
          <h3 className="mt-2 text-sm font-semibold text-gray-900 line-clamp-2 hover:text-primary-700 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-auto pt-2 text-base font-bold text-primary-700">
          {product.price_per_box.toLocaleString()}
          <span className="text-sm font-medium text-gray-400">원</span>
        </p>

        {/* Add to cart */}
        <motion.button
          type="button"
          onClick={handleAdd}
          whileTap={{ scale: 0.96 }}
          className={`mt-3 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl text-sm font-semibold transition-all ${
            added
              ? "border border-emerald-200 bg-emerald-50 text-emerald-600"
              : "border border-primary-200 bg-white text-primary-700 hover:bg-primary-50"
          }`}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span key="ok" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                <Check size={14} /> 담았습니다
              </motion.span>
            ) : (
              <motion.span key="add" initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                <ShoppingBag size={14} /> 담기
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
