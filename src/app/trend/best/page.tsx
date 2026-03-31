"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ShoppingCart, Package, Check } from "lucide-react";
import { Header } from "@/components/header";
import { AiInsightCard } from "@/components/ai-insight-card";
import { useBestSellers } from "@/lib/queries";
import { useCartStore } from "@/store/cart-store";
import { api } from "@/lib/api";
import type { TrendRankItem, ApiResponse, Product } from "@/types";

const businessTypes = [
  "카페/베이커리",
  "식당/외식업",
  "미용실/뷰티",
  "편의점/소매업",
  "네일샵/피부샵",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function RankNumber({ rank }: { rank: number }) {
  if (rank <= 3) {
    const styles: Record<number, string> = {
      1: "bg-primary-700 text-white",
      2: "bg-primary-500 text-white",
      3: "bg-primary-300 text-primary-900",
    };
    return (
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full ${styles[rank]} text-sm font-bold`}
      >
        {rank}
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 items-center justify-center text-base font-bold text-gray-300">
      {rank}
    </span>
  );
}

export default function BestSellersPage() {
  const [activeTab, setActiveTab] = useState(businessTypes[0]);
  const [addedId, setAddedId] = useState<string | null>(null);
  const addItem = useCartStore((s) => s.addItem);
  const { data, isLoading } = useBestSellers(activeTab);
  const ranking: TrendRankItem[] = data?.data?.ranking || [];
  const aiInsight = data?.data?.ai_insight;

  const handleAddToCart = async (item: TrendRankItem) => {
    try {
      const res = await api.get(`/products/${item.product_id}`) as ApiResponse<Product>;
      if (res.data) {
        addItem(res.data, 1);
        setAddedId(item.product_id);
        setTimeout(() => setAddedId(null), 1500);
      }
    } catch {
      alert("상품 정보를 불러올 수 없습니다.");
    }
  };

  const topItems = ranking.slice(0, 10);
  const frequentlyBoughtTogether = ranking.slice(5, 10);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      <main className="mx-auto max-w-layout px-4 md:px-8 lg:px-20 py-10 flex flex-col gap-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            업종별 베스트셀러
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            동종 업종 소상공인의 최근 구매한 상품 | {new Date().getFullYear()}년{" "}
            {new Date().getMonth() + 1}월 기준
          </p>
        </motion.div>

        {/* Business type tabs - pill style */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          role="tablist"
          className="flex gap-2 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-sm border border-gray-100"
        >
          {businessTypes.map((type) => (
            <button
              key={type}
              role="tab"
              aria-selected={activeTab === type}
              onClick={() => setActiveTab(type)}
              className="relative shrink-0 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
            >
              {activeTab === type && (
                <motion.div
                  layoutId="activeTabBg"
                  className="absolute inset-0 rounded-xl bg-primary-700"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className={`relative z-10 ${activeTab === type ? "text-white" : "text-gray-500 hover:text-gray-700"}`}>
                {type}
              </span>
            </button>
          ))}
        </motion.div>

        {/* AI Insight */}
        {aiInsight && <AiInsightCard insight={aiInsight} />}

        {/* Section title */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700">
            <Package size={15} className="text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">
            {activeTab} 업종 이번 달 TOP 10
          </h2>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-24"
            >
              <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-8"
            >
              {/* Rank list */}
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
                {topItems.length === 0 ? (
                  <div className="px-6 py-16 text-center text-sm text-gray-400">
                    데이터가 없습니다.
                  </div>
                ) : (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {topItems.map((item, index) => (
                      <motion.div
                        key={item.rank}
                        variants={rowVariants}
                        className={`group flex items-center gap-5 px-6 py-4.5 transition-colors hover:bg-gray-50/80 ${
                          index < topItems.length - 1
                            ? "border-b border-gray-50"
                            : ""
                        }`}
                      >
                        {/* Rank */}
                        <RankNumber rank={item.rank} />

                        {/* Product name */}
                        <span className="flex-1 text-sm font-medium text-gray-800 group-hover:text-gray-900 transition-colors">
                          {item.name}
                        </span>

                        {/* Category */}
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                          {item.category}
                        </span>

                        {/* Sales count */}
                        <span className="w-20 text-right text-sm font-semibold text-gray-500">
                          {item.order_count.toLocaleString()}건
                        </span>

                        {/* Add to cart button */}
                        <motion.button
                          onClick={() => handleAddToCart(item)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label={`${item.name} 담기`}
                          className={`shrink-0 flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                            addedId === item.product_id
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                              : "bg-primary-50 text-primary-700 hover:bg-primary-700 hover:text-white"
                          }`}
                        >
                          {addedId === item.product_id ? (
                            <>
                              <Check size={14} />
                              담음
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={14} />
                              담기
                            </>
                          )}
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Frequently bought together section */}
              {frequentlyBoughtTogether.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500">
                      <ShoppingCart size={15} className="text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                      함께 많이 구매한 상품
                    </h2>
                  </div>
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
                  >
                    {frequentlyBoughtTogether.map((item) => (
                      <motion.div
                        key={item.product_id}
                        variants={cardVariants}
                        whileHover={{ y: -6, transition: { duration: 0.2 } }}
                        className="group rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer"
                      >
                        {/* Image placeholder */}
                        <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                          <Package size={28} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
                          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                        </div>

                        {/* Product info */}
                        <div className="p-4">
                          <span className="inline-block rounded-full bg-gradient-to-r from-gray-100 to-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-gray-500">
                            {item.category}
                          </span>
                          <p className="mt-2 text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-gray-900 transition-colors">
                            {item.name}
                          </p>
                          <p className="mt-1.5 text-xs text-gray-400">
                            {item.order_count.toLocaleString()}건 주문
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
