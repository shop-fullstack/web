"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Plus, Package, CalendarClock, Truck } from "lucide-react";
import { Header } from "@/components/header";
import type { SubscriptionItem } from "@/types";

const initialSubscriptions: SubscriptionItem[] = [
  {
    id: "sub-1",
    product: {
      id: "1",
      name: "일회용 종이컵 6.5oz 1000개입",
      category: "소모품",
      price_per_unit: 27.5,
      price_per_box: 27500,
      moq: 1,
      image_url: "",
      created_at: "2025-03-20",
    },
    cycle: "월 1회",
    quantity: 1,
    next_delivery: "2025년 4월 5일 (목)",
    active: true,
  },
  {
    id: "sub-2",
    product: {
      id: "2",
      name: "업소용 위생장갑 (L) 100매",
      category: "소모품",
      price_per_unit: 42,
      price_per_box: 4200,
      moq: 1,
      image_url: "",
      created_at: "2025-03-18",
    },
    cycle: "월 1회",
    quantity: 1,
    next_delivery: "2025년 4월 12일 (목)",
    active: false,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);

  const toggleSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, active: !sub.active } : sub
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      <main className="mx-auto max-w-layout px-4 md:px-8 lg:px-20 py-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            정기구독 관리
          </h1>
          <p className="text-sm text-gray-500">
            자주 구매하는 상품을 정기적으로 편리하게 받으세요
          </p>
        </motion.div>

        {/* Subscription cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 flex flex-col gap-5"
        >
          {subscriptions.map((sub) => (
            <motion.div
              key={sub.id}
              variants={cardVariants}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
              className={`rounded-2xl bg-white border shadow-sm p-6 transition-all hover:shadow-md ${
                sub.active ? "border-gray-100" : "border-gray-100 opacity-75"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                {/* Left content */}
                <div className="flex gap-5 min-w-0">
                  {/* Product icon */}
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                    sub.active
                      ? "bg-primary-50"
                      : "bg-gray-50"
                  }`}>
                    <Package size={24} className={sub.active ? "text-primary-500" : "text-gray-300"} />
                  </div>

                  <div className="flex flex-col gap-3">
                    {/* Product name + badge */}
                    <div className="flex items-center gap-3">
                      <span className="text-[15px] font-bold text-gray-900">
                        {sub.product.name}
                      </span>
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                        {sub.product.category}
                      </span>
                    </div>

                    {/* Cycle + quantity */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <CalendarClock size={14} className="text-gray-400" />
                        {sub.cycle}
                      </span>
                      <span className="h-3.5 w-px bg-gray-200" />
                      <span>총 {sub.quantity}개</span>
                    </div>

                    {/* Next delivery */}
                    <p className="flex items-center gap-1.5 text-sm text-gray-400">
                      <Truck size={14} />
                      다음 배송 예정일: {sub.next_delivery}
                    </p>

                    {/* Paused indicator */}
                    <AnimatePresence>
                      {!sub.active && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <span className="inline-flex items-center rounded-full bg-gray-100 border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600">
                            일시정지됨
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  onClick={() => toggleSubscription(sub.id)}
                  role="switch"
                  aria-checked={sub.active}
                  aria-label={sub.active ? "구독 일시정지" : "구독 재개"}
                  className={`relative mt-2 h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${
                    sub.active
                      ? "bg-primary-500"
                      : "bg-gray-200"
                  }`}
                >
                  <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md ${
                      sub.active ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Add subscription button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 px-6 py-3.5 text-sm font-semibold text-gray-500 transition-all hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50/50"
          >
            <Plus size={18} className="transition-transform group-hover:rotate-90" />
            구독 상품 추가하기
          </Link>
        </motion.div>

        {/* Warning banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="mt-8 flex items-center gap-4 rounded-2xl bg-gray-50 border border-gray-200 px-6 py-5"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-400">
            <AlertTriangle size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              데모 기능 안내
            </p>
            <p className="mt-0.5 text-sm text-gray-500">
              정기구독은 데모 기능입니다. 월별 결제 및 배송은 기능적으로 시뮬레이팅됩니다.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
