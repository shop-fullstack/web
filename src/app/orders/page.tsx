"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { dummyOrders } from "@/lib/dummy-data";
import type { Order } from "@/types";

const STATUS_TABS = ["전체", "주문완료", "배송중", "배송완료"] as const;

function getStatusBadgeClasses(status: Order["status"]) {
  switch (status) {
    case "배송완료":
      return "bg-success-light text-success";
    case "배송중":
      return "bg-warning-light text-warning";
    case "주문완료":
      return "bg-info-light text-primary-500";
    case "배송준비":
      return "bg-info-light text-primary-500";
    default:
      return "bg-gray-200 text-gray-500";
  }
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function getOrderSummary(order: Order) {
  const firstName = order.items[0].product_name;
  if (order.items.length === 1) return firstName;
  return `${firstName} 외 ${order.items.length - 1}건`;
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<string>("전체");

  const filteredOrders =
    activeTab === "전체"
      ? dummyOrders
      : dummyOrders.filter((o) => o.status === activeTab);

  const tabCounts = STATUS_TABS.map((tab) => {
    if (tab === "전체") return dummyOrders.length;
    return dummyOrders.filter((o) => o.status === tab).length;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-layout px-20 py-8">
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900">주문 내역</h1>

        {/* Tabs */}
        <div className="mt-6 flex gap-6 border-b border-gray-200">
          {STATUS_TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-primary-700 text-primary-700"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab} ({tabCounts[i]})
            </button>
          ))}
        </div>

        {/* Order Cards */}
        <div className="mt-6 flex flex-col gap-4">
          {filteredOrders.length === 0 && (
            <p className="py-16 text-center text-gray-500">
              해당 상태의 주문이 없습니다.
            </p>
          )}

          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-gray-200 bg-white p-6"
            >
              {/* Top Row: date, order number, status badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {formatDate(order.created_at)}
                  </span>
                  <span className="text-sm text-gray-500">
                    주문번호 {order.order_number}
                  </span>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeClasses(order.status)}`}
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
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:border-gray-500 hover:text-gray-900"
                >
                  배송 조회
                </Link>
                <button className="rounded-lg bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-500 hover:text-white">
                  재주문
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
