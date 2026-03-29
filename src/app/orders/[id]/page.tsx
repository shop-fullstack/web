"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Circle, Package, Truck } from "lucide-react";
import { Header } from "@/components/header";
import { useOrder } from "@/lib/queries";
import type { Order } from "@/types";

const DELIVERY_STEPS = ["주문완료", "배송준비", "배송중", "배송완료"] as const;

const STEP_ICONS = [CheckCircle, Package, Truck, CheckCircle];

/** For the demo, map order status to how many steps are completed (inclusive). */
function getCompletedStepCount(status: Order["status"]): number {
  const index = DELIVERY_STEPS.indexOf(status);
  return index >= 0 ? index + 1 : 1;
}

/** Dates for each completed step (demo only). */
function getStepDates(order: Order): (string | null)[] {
  const completedCount = getCompletedStepCount(order.status);
  const base = new Date(order.created_at);

  return DELIVERY_STEPS.map((_, i) => {
    if (i >= completedCount) return null;
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
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
        <main className="mx-auto max-w-layout px-20 py-8">
          <p className="py-16 text-center text-gray-500">
            주문 정보를 불러오는 중...
          </p>
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="mx-auto max-w-layout px-20 py-8">
          <p className="py-16 text-center text-gray-500">
            주문을 찾을 수 없습니다.
          </p>
          <div className="text-center">
            <Link
              href="/orders"
              className="text-sm font-medium text-primary-700 hover:underline"
            >
              주문 내역으로 돌아가기
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const completedCount = getCompletedStepCount(order.status);
  const stepDates = getStepDates(order);

  const totalQuantityLabel = order.items.reduce((sum, item) => sum + item.quantity, 0) + "박스";
  const productName =
    order.items.length === 1
      ? order.items[0].name
      : `${order.items[0].name} 외 ${order.items.length - 1}건`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-layout px-20 py-8">
        {/* Back link */}
        <Link
          href="/orders"
          className="mb-4 inline-block text-sm text-gray-500 hover:text-gray-900"
        >
          &larr; 주문 내역
        </Link>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900">배송 조회</h1>
        <p className="mt-1 text-sm text-gray-500">
          주문번호 {order.id}
        </p>

        {/* Order Summary Card */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-8">
              <div>
                <span className="text-xs text-gray-500">상품명</span>
                <p className="mt-0.5 text-sm font-semibold text-gray-900">
                  {productName}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500">수량</span>
                <p className="mt-0.5 text-sm font-semibold text-gray-900">
                  {totalQuantityLabel}
                </p>
              </div>
              <div>
                <span className="text-xs text-gray-500">주문일</span>
                <p className="mt-0.5 text-sm font-semibold text-gray-900">
                  {formatLongDate(order.created_at)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500">총 금액</span>
              <p className="mt-0.5 text-sm font-bold text-primary-700">
                {order.total_amount.toLocaleString()}원
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Steps Card */}
        <div className="mt-4 rounded-lg border border-gray-200 bg-white px-12 py-8">
          <div className="flex items-start justify-between">
            {DELIVERY_STEPS.map((step, i) => {
              const isCompleted = i < completedCount;
              const Icon = STEP_ICONS[i];

              return (
                <div key={step} className="relative flex flex-1 flex-col items-center">
                  {/* Connecting line (to the right of this step) */}
                  {i < DELIVERY_STEPS.length - 1 && (
                    <div
                      className={`absolute top-5 left-[calc(50%+20px)] h-0.5 w-[calc(100%-40px)] ${
                        i < completedCount - 1 ? "bg-primary-700" : "bg-gray-200"
                      }`}
                    />
                  )}

                  {/* Circle icon */}
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${
                      isCompleted
                        ? "bg-primary-700 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <Icon size={20} />
                    ) : (
                      <Circle size={20} />
                    )}
                  </div>

                  {/* Step label */}
                  <p
                    className={`mt-3 text-sm font-medium ${
                      isCompleted ? "text-primary-700" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </p>

                  {/* Step date */}
                  <p className="mt-1 text-xs text-gray-500">
                    {stepDates[i] ?? "-"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Info Card */}
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-base font-bold text-gray-900">배송 정보</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm text-gray-500">택배사</span>
              <span className="text-sm font-medium text-gray-900">
                CJ대한통운
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm text-gray-500">운송장번호</span>
              <span className="text-sm font-medium text-gray-900">
                -
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-sm text-gray-500">예상 배송일</span>
              <span className="text-sm font-medium text-gray-900">
                {order.delivery_date ? formatLongDate(order.delivery_date) : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-6 text-center text-sm italic text-gray-500">
          ※ 배송 조회는 UI 데모입니다. 실제 배송 연동은 포함되지 않습니다.
        </p>
      </main>
    </div>
  );
}
