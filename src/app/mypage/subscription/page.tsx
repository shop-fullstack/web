"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Header } from "@/components/header";
import { dummySubscriptions } from "@/lib/dummy-data";

export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState(dummySubscriptions);

  const toggleSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, active: !sub.active } : sub
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-layout px-20 py-8">
        {/* Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900">정기구독 관리</h1>
          <p className="text-sm text-gray-500">
            자주 구매하는 상품을 정기적으로 편리하게 받으세요
          </p>
        </div>

        {/* Subscription cards */}
        <div className="mt-6 flex flex-col gap-6">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="rounded-lg border border-gray-200 bg-white p-6"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left content */}
                <div className="flex flex-col gap-4">
                  {/* Product name + badge */}
                  <div className="flex items-center gap-3">
                    <span className="text-[15px] font-bold text-gray-900">
                      {sub.product.name}
                    </span>
                    <span className="rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                      {sub.product.category}
                    </span>
                  </div>

                  {/* Cycle + quantity */}
                  <div className="flex items-center gap-4 text-sm text-gray-900">
                    <span>{sub.cycle}</span>
                    <span className="text-gray-200">|</span>
                    <span>총 {sub.quantity}개</span>
                  </div>

                  {/* Next delivery */}
                  <p className="text-sm text-gray-500">
                    다음 배송 예정일: {sub.next_delivery}
                  </p>
                </div>

                {/* Toggle switch */}
                <button
                  onClick={() => toggleSubscription(sub.id)}
                  className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors ${
                    sub.active ? "bg-primary-500" : "bg-gray-200"
                  }`}
                  aria-label={sub.active ? "구독 일시정지" : "구독 재개"}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      sub.active ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Paused indicator */}
              {!sub.active && (
                <div className="mt-3 inline-flex rounded-full bg-warning-light px-3 py-1 text-xs font-medium text-warning">
                  일시정지됨
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add subscription button */}
        <div className="mt-6">
          <Link
            href="/products"
            className="inline-flex items-center rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-primary-700 transition-colors hover:border-primary-700 hover:bg-primary-100"
          >
            구독 상품 추가하기
          </Link>
        </div>

        {/* Warning banner */}
        <div className="mt-6 flex items-start gap-3 rounded-lg bg-warning-light px-5 py-4">
          <AlertTriangle size={18} className="mt-0.5 shrink-0 text-warning" />
          <p className="text-sm text-gray-900">
            정기구독은 데모 기능입니다. 월별 결제 및 배송은 기능적으로
            시뮬레이팅됩니다.
          </p>
        </div>
      </main>
    </div>
  );
}
