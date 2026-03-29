"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import {
  dummyBestSellers,
  dummyProducts,
  businessTypes,
} from "@/lib/dummy-data";

export default function BestSellersPage() {
  const [activeTab, setActiveTab] = useState(businessTypes[0]);

  // Pick 5 products for the "frequently bought together" section
  const frequentlyBoughtTogether = dummyProducts.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-layout px-20 py-8 flex flex-col gap-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            업종별 베스트셀러
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            동종 업종 소상공인의 최근 구매한 상품 | 2025년 3월 기준
          </p>
        </div>

        {/* Business type tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {businessTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`shrink-0 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                activeTab === type
                  ? "bg-primary-700 text-white"
                  : "border border-gray-200 text-gray-500 hover:border-gray-500 hover:text-gray-900"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Section title */}
        <h2 className="text-lg font-bold text-gray-900">
          {activeTab} 업종 이번 달 TOP 10
        </h2>

        {/* Rank list */}
        <div className="rounded-lg border border-gray-200 bg-white">
          {dummyBestSellers.map((item, index) => (
            <div
              key={item.rank}
              className={`flex items-center gap-6 px-6 py-5 ${
                index < dummyBestSellers.length - 1
                  ? "border-b border-gray-200"
                  : ""
              }`}
            >
              {/* Rank number */}
              <span className="w-8 shrink-0 text-xl font-bold text-gray-900">
                {item.rank}
              </span>

              {/* Product name */}
              <span className="flex-1 text-sm font-medium text-gray-900">
                {item.product_name}
              </span>

              {/* Price */}
              <span className="text-sm text-gray-500">{item.price}</span>

              {/* Sales count */}
              <span className="w-20 text-right text-sm text-gray-500">
                {item.sales_count}
              </span>

              {/* Add to cart button */}
              <button className="shrink-0 rounded-lg bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-500 hover:text-white">
                담기
              </button>
            </div>
          ))}
        </div>

        {/* Frequently bought together section */}
        <div className="mt-4">
          <h2 className="text-lg font-bold text-gray-900">
            함께 많이 구매한 상품
          </h2>
          <div className="mt-4 grid grid-cols-5 gap-4">
            {frequentlyBoughtTogether.map((product) => (
              <div
                key={product.id}
                className="rounded-lg border border-gray-200 bg-white overflow-hidden"
              >
                {/* Image placeholder */}
                <div className="flex h-36 items-center justify-center bg-gray-50">
                  <span className="text-sm text-gray-500">이미지</span>
                </div>

                {/* Product info */}
                <div className="p-4">
                  <span className="inline-block rounded bg-gray-200 px-2 py-0.5 text-xs text-gray-500">
                    {product.category}
                  </span>
                  <p className="mt-2 text-sm font-medium text-gray-900 line-clamp-2">
                    {product.name}
                  </p>
                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {product.price.toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
