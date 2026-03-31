"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Circle, Package, Truck, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { useOrder } from "@/lib/queries";
import type { Order } from "@/types";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const DELIVERY_STEPS = ["주문완료", "배송준비", "배송중", "배송완료"] as const;
const STEP_ICONS = [CheckCircle, Package, Truck, CheckCircle];

function getCompletedStepCount(status: Order["status"]): number {
  const index = DELIVERY_STEPS.indexOf(status);
  return index >= 0 ? index + 1 : 1;
}

function getStepDates(order: Order): (string | null)[] {
  const completedCount = getCompletedStepCount(order.status);
  const base = new Date(order.created_at);
  return DELIVERY_STEPS.map((_, i) => {
    if (i >= completedCount) return null;
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  });
}

function formatLongDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { data, isLoading } = useOrder(orderId);
  const order = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-32">
          <Package className="h-16 w-16 text-gray-200" />
          <p className="mt-4 text-lg font-medium text-gray-900">주문을 찾을 수 없습니다</p>
          <Link
            href="/orders"
            className="mt-4 rounded-xl bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-900"
          >
            주문 내역으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = getCompletedStepCount(order.status);
  const stepDates = getStepDates(order);
  const totalQuantityLabel = order.items?.reduce((sum, item) => sum + item.quantity, 0) + "박스";
  const productName =
    !order.items || order.items.length === 0
      ? "주문 상품"
      : order.items.length === 1
        ? order.items[0].name
        : `${order.items[0].name} 외 ${order.items.length - 1}건`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <motion.main
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mx-auto max-w-layout px-4 md:px-8 lg:px-20 py-8"
      >
        <motion.div variants={fadeUp}>
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
          >
            <ArrowLeft size={16} /> 주문 내역
          </Link>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900">배송 조회</h1>
          <p className="mt-1 text-sm text-gray-500">주문번호 {order.id}</p>
        </motion.div>

        {/* Order Summary Card */}
        <motion.div
          variants={fadeUp}
          className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-8">
              {[
                { label: "상품명", value: productName },
                { label: "수량", value: totalQuantityLabel },
                { label: "주문일", value: formatLongDate(order.created_at) },
              ].map((item) => (
                <div key={item.label}>
                  <span className="text-xs font-medium text-gray-500">{item.label}</span>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-primary-50 px-5 py-3">
              <span className="text-xs text-gray-500">총 금액</span>
              <p className="text-lg font-bold text-primary-700">
                {order.total_amount.toLocaleString()}원
              </p>
            </div>
          </div>
        </motion.div>

        {/* Delivery Steps Card */}
        <motion.div
          variants={fadeUp}
          className="mt-4 rounded-2xl border border-gray-100 bg-white px-8 py-10 shadow-sm md:px-16"
        >
          <div className="flex items-start justify-between" role="list">
            {DELIVERY_STEPS.map((step, i) => {
              const isCompleted = i < completedCount;
              const isCurrent = i === completedCount - 1;
              const Icon = STEP_ICONS[i];

              return (
                <div
                  key={step}
                  className="relative flex flex-1 flex-col items-center"
                  role="listitem"
                  {...(isCurrent ? { "aria-current": "step" as const } : {})}
                >
                  {i < DELIVERY_STEPS.length - 1 && (
                    <div
                      className={`absolute top-6 left-[calc(50%+24px)] h-[3px] w-[calc(100%-48px)] rounded-full transition-colors ${
                        i < completedCount - 1
                          ? "bg-primary-700"
                          : "bg-gray-100"
                      }`}
                    />
                  )}

                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.15, type: "spring", stiffness: 300 }}
                    className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                      isCompleted
                        ? isCurrent
                          ? "bg-primary-700 text-white ring-4 ring-primary-100"
                          : "bg-primary-700 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isCompleted ? <Icon size={20} /> : <Circle size={20} />}
                  </motion.div>

                  <p
                    className={`mt-3 text-sm font-medium ${
                      isCompleted ? "text-primary-700" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">{stepDates[i] ?? "-"}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Delivery Info Card */}
        <motion.div
          variants={fadeUp}
          className="mt-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <h2 className="text-base font-bold text-gray-900">배송 정보</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "택배사", value: "CJ대한통운" },
              { label: "운송장번호", value: "-" },
              { label: "예상 배송일", value: order.delivery_date ? formatLongDate(order.delivery_date) : "-" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-4">
                <span className="w-24 text-sm text-gray-500">{row.label}</span>
                <span className="text-sm font-medium text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.p variants={fadeUp} className="mt-8 text-center text-xs text-gray-500">
          ※ 배송 조회는 UI 데모입니다. 실제 배송 연동은 포함되지 않습니다.
        </motion.p>
      </motion.main>
    </div>
  );
}
