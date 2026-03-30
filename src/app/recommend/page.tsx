"use client";

import { useState } from "react";
import { Sparkles, Loader2, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/header";
import { RecommendationCard } from "@/components/recommend/recommendation-card";
import { useRecommendations } from "@/lib/queries";
import { useAuthStore } from "@/store/auth-store";

const FILTER_TABS = ["전체", "업종 맞춤", "트렌드 기반", "구매 패턴", "유사 상품"] as const;
const FILTER_MAP: Record<string, string | undefined> = {
  "전체": undefined,
  "업종 맞춤": "business_type",
  "트렌드 기반": "trending",
  "구매 패턴": "order_history",
  "유사 상품": "similar",
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};

export default function RecommendPage() {
  const { isAuthenticated, user } = useAuthStore();
  const businessType = user?.business_type ?? "";
  const { data, isLoading } = useRecommendations(businessType);
  const items = data?.data?.items ?? [];
  const [activeTab, setActiveTab] = useState<string>("전체");

  const filterType = FILTER_MAP[activeTab];
  const filtered = filterType ? items.filter((i) => i.reason_type === filterType) : items;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-32">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
            <LogIn size={32} className="text-primary-400" />
          </div>
          <p className="mt-5 text-lg font-semibold text-gray-900">로그인이 필요합니다</p>
          <p className="mt-1.5 text-sm text-gray-500">맞춤 추천을 받으려면 로그인해주세요</p>
          <Link
            href="/login"
            className="mt-6 rounded-xl bg-gradient-to-r from-primary-700 to-primary-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-200"
          >
            로그인하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <Header />

      <div className="mx-auto max-w-layout px-8 py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-10 py-10 text-white shadow-xl"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 text-sm font-medium text-white/80">
              <Sparkles size={16} />
              AI 맞춤 추천
            </div>
            <h1 className="mt-2 text-3xl font-bold">
              {user?.owner_name}님을 위한 추천 상품
            </h1>
            <p className="mt-2 text-sm text-white/70">
              {businessType} 업종 데이터와 주문 패턴을 분석하여 추천합니다
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-8 inline-flex rounded-2xl bg-gray-100 p-1 gap-1"
        >
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  isActive ? "text-white" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="recTab"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 shadow-sm"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-6 grid grid-cols-4 gap-5"
            >
              {filtered.map((item) => (
                <motion.div key={item.product.id} variants={itemVariants}>
                  <RecommendationCard item={item} />
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-4 py-16 text-center text-gray-400"
                >
                  해당 유형의 추천 상품이 없습니다
                </motion.p>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
