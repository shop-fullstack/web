"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { useOrders } from "@/lib/queries";
import { api } from "@/lib/api";
import { useCartStore } from "@/store/cart-store";
import type { Order, ApiResponse, Product } from "@/types";

const STATUS_TABS = ["전체", "주문완료", "배송중", "배송완료"] as const;

function getStatusBadgeClasses(status: Order["status"]) {
  switch (status) {
    case "배송완료":
      return "bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm shadow-emerald-100";
    case "배송중":
      return "bg-amber-50 text-amber-600 border border-amber-200 shadow-sm shadow-amber-100";
    case "주문완료":
      return "bg-blue-50 text-blue-600 border border-blue-200 shadow-sm shadow-blue-100";
    case "배송준비":
      return "bg-violet-50 text-violet-600 border border-violet-200 shadow-sm shadow-violet-100";
    default:
      return "bg-gray-100 text-gray-500 border border-gray-200";
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function getOrderSummary(order: Order) {
  if (!order.items || order.items.length === 0) return "주문 상품";
  const firstName = order.items[0].name;
  if (order.items.length === 1) return firstName;
  return `${firstName} 외 ${order.items.length - 1}건`;
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: "easeOut" as const },
  }),
};

export default function OrdersPage() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [activeTab, setActiveTab] = useState<string>("전체");

  const statusParam = activeTab === "전체" ? "all" : activeTab;
  const { data, isLoading } = useOrders(statusParam);
  const orders: Order[] = data?.data ?? [];

  // For tab counts, use the "all" query to get total counts
  const { data: allData } = useOrders("all");
  const allOrders: Order[] = allData?.data ?? [];

  const tabCounts = STATUS_TABS.map((tab) => {
    if (tab === "전체") return allOrders.length;
    return allOrders.filter((o) => o.status === tab).length;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-layout px-20 py-8">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold text-gray-900"
        >
          주문 내역
        </motion.h1>

        {/* Pill-style Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-6 inline-flex rounded-2xl bg-gray-100 p-1 gap-1"
        >
          {STATUS_TABS.map((tab, i) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-primary-700 shadow-sm"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">
                  {tab} ({tabCounts[i]})
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-16 flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-2 border-primary-200 border-t-primary-700 animate-spin mb-4" />
            <p className="text-gray-400 text-sm">
              주문 내역을 불러오는 중...
            </p>
          </div>
        )}

        {/* Order Cards */}
        {!isLoading && (
          <div className="mt-6 flex flex-col gap-4">
            <AnimatePresence mode="wait">
              {orders.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-16 text-center text-gray-400"
                >
                  해당 상태의 주문이 없습니다.
                </motion.p>
              )}

              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  layout
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  {/* Top Row: date, order number, status badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-400">
                        {formatDate(order.created_at)}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-gray-300" />
                      <span className="text-sm text-gray-400">
                        주문번호 {order.id}
                      </span>
                    </div>
                    <span
                      className={`rounded-full px-3.5 py-1 text-xs font-semibold ${getStatusBadgeClasses(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Middle: product summary + total price */}
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-[15px] font-semibold text-gray-900">
                      {getOrderSummary(order)}
                    </p>
                    <p className="text-[15px] font-bold text-primary-700">
                      총 {order.total_amount.toLocaleString()}원
                    </p>
                  </div>

                  {/* Bottom: buttons */}
                  <div className="mt-5 flex items-center justify-end gap-3">
                    <Link
                      href={`/orders/${order.id}`}
                      className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 transition-all duration-200 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50"
                    >
                      배송 조회
                    </Link>
                    <button
                      onClick={async () => {
                        try {
                          const results = await Promise.all(
                            order.items.map((item) =>
                              api.get(`/products/${item.product_id}`) as Promise<ApiResponse<Product>>
                            )
                          );
                          results.forEach((res, i) => {
                            if (res.data) {
                              addItem(res.data, order.items[i].quantity);
                            }
                          });
                          router.push("/cart");
                        } catch {
                          alert("일부 상품을 불러올 수 없습니다. 다시 시도해주세요.");
                        }
                      }}
                      className="rounded-xl bg-primary-50 px-4 py-2 text-sm font-semibold text-primary-700 transition-all duration-200 hover:bg-primary-700 hover:text-white hover:shadow-md hover:shadow-primary-700/20"
                    >
                      재주문
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
