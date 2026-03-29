"use client";

import { TrendingUp, BarChart3, Users, ShoppingBag, Loader2 } from "lucide-react";
import { Header } from "@/components/header";
import { useTrendReport } from "@/lib/queries";
import type { TrendRankItem } from "@/types";

function getChangeIndicator(change: TrendRankItem["change"]) {
  switch (change) {
    case "up":
      return <span className="text-success">▲</span>;
    case "down":
      return <span className="text-red-500">▼</span>;
    case "same":
      return <span className="text-gray-400">—</span>;
    case "new":
      return <span className="rounded bg-primary-100 px-1.5 py-0.5 text-xs font-bold text-primary-700">NEW</span>;
  }
}

export default function TrendReportPage() {
  const { data, isLoading } = useTrendReport("weekly");
  const ranking: TrendRankItem[] = data?.data?.ranking || [];

  const topProduct = ranking[0];
  const risingProduct = ranking.find((item) => item.change === "up");
  const uniqueCategories = new Set(ranking.map((item) => item.category)).size;

  // Compute category distribution from ranking data
  const categoryCountMap: Record<string, number> = {};
  for (const item of ranking) {
    categoryCountMap[item.category] = (categoryCountMap[item.category] || 0) + 1;
  }
  const totalItems = ranking.length;
  const categoryDistribution = Object.entries(categoryCountMap)
    .map(([category, count]) => ({
      category,
      percentage: totalItems > 0 ? Math.round((count / totalItems) * 100) : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-layout px-20 py-8 flex flex-col gap-6">
        {/* Title row */}
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              트렌드 리포트
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              실시간 주문 데이터 기반 상시업 트렌드 분석
            </p>
          </div>
          <span className="text-sm text-gray-500">
            {data?.data?.generated_at
              ? new Date(data.data.generated_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-4 gap-4">
              {/* Stat 1 - Most popular product */}
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <ShoppingBag size={16} />
                  <span>최근 인기 상품</span>
                </div>
                <p className="mt-2 text-lg font-bold text-gray-900">
                  {topProduct?.name ?? "—"}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {topProduct
                    ? `${topProduct.order_count.toLocaleString()}건 주문`
                    : "데이터 없음"}
                </p>
              </div>

              {/* Stat 2 - Rising product */}
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <TrendingUp size={16} />
                  <span>급상승 상품</span>
                </div>
                <p className="mt-2 text-lg font-bold text-gray-900">
                  {risingProduct?.name ?? "—"}
                </p>
                <p className="mt-1 text-xs text-success">
                  {risingProduct ? "▲ 급상승" : ""}
                </p>
              </div>

              {/* Stat 3 - Category count */}
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <BarChart3 size={16} />
                  <span>카테고리 구분 상품</span>
                </div>
                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {uniqueCategories}개
                </p>
              </div>

              {/* Stat 4 - Total buyers */}
              <div className="rounded-lg border border-gray-200 bg-white p-5">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users size={16} />
                  <span>누적 구매자</span>
                </div>
                <p className="mt-3 text-2xl font-bold text-gray-900">
                  {ranking
                    .reduce((sum, item) => sum + item.order_count, 0)
                    .toLocaleString()}
                  명
                </p>
              </div>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left: TOP 10 popular products table */}
              <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-base font-bold text-gray-900">
                    TOP 10 인기 상품
                  </h2>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs text-gray-500">
                      <th className="px-6 py-3 text-left font-medium">순위</th>
                      <th className="px-6 py-3 text-left font-medium">상품명</th>
                      <th className="px-6 py-3 text-center font-medium">변동</th>
                      <th className="px-6 py-3 text-right font-medium">판매량</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranking.slice(0, 10).map((item) => (
                      <tr
                        key={item.rank}
                        className="border-b border-gray-200 last:border-b-0"
                      >
                        <td className="px-6 py-4">
                          {item.rank <= 3 ? (
                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                              {item.rank}
                            </span>
                          ) : (
                            <span className="pl-2 text-sm font-medium text-gray-500">
                              {item.rank}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 text-center text-sm">
                          {getChangeIndicator(item.change)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                          {item.order_count.toLocaleString()}건
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Right: Category distribution bar chart */}
              <div className="rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="text-base font-bold text-gray-900">
                  카테고리별 판매 현황
                </h2>
                <div className="mt-6 flex flex-col gap-5">
                  {categoryDistribution.map((cat) => (
                    <div key={cat.category} className="flex items-center gap-4">
                      <span className="w-16 shrink-0 text-sm text-gray-900">
                        {cat.category}
                      </span>
                      <div className="relative flex-1">
                        <div className="h-8 w-full rounded bg-gray-50" />
                        <div
                          className="absolute left-0 top-0 h-8 rounded bg-primary-700"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                      <span className="w-10 shrink-0 text-right text-sm font-medium text-gray-900">
                        {cat.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
