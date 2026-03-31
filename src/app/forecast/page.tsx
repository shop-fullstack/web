"use client";

import { useState } from "react";
import { BarChart3, Table2, TrendingUp, TrendingDown, AlertTriangle, Loader2, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/header";
import { AiInsightCard } from "@/components/ai-insight-card";
import { ForecastChart } from "@/components/forecast/forecast-chart";
import { ForecastTable } from "@/components/forecast/forecast-table";
import { useForecast } from "@/lib/queries";
import { useAuthStore } from "@/store/auth-store";

const CHART_COLORS = [
  "from-primary-700 to-primary-500",
  "from-primary-600 to-primary-400",
  "from-primary-700 to-primary-500",
  "from-primary-600 to-primary-400",
  "from-primary-700 to-primary-500",
  "from-primary-600 to-primary-400",
];

export default function ForecastPage() {
  const { isAuthenticated, user } = useAuthStore();
  const businessType = user?.business_type ?? "";
  const { data, isLoading } = useForecast(businessType);
  const forecasts = data?.data?.forecasts ?? [];
  const aiInsight = data?.data?.ai_insight;
  const [view, setView] = useState<"chart" | "table">("chart");

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center py-32">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
            <LogIn size={32} className="text-primary-400" />
          </div>
          <p className="mt-5 text-lg font-semibold text-gray-900">로그인이 필요합니다</p>
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

  // Summary stats
  const totalNextWeek = forecasts.reduce((s, f) => s + (f.forecast[0]?.predicted_orders ?? 0), 0);
  const risingProduct = [...forecasts].sort((a, b) => b.change_percent - a.change_percent)[0];
  const decliningProduct = [...forecasts].sort((a, b) => a.change_percent - b.change_percent)[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <Header />

      <div className="mx-auto max-w-layout px-8 py-10">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">수요 예측 대시보드</h1>
          <p className="mt-2 text-sm text-gray-500">
            AI 기반 4주 수요 예측으로 재고 관리를 최적화하세요
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
          </div>
        ) : (
          <>
            {/* Stat Cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-5"
            >
              {/* Total */}
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 shadow-sm">
                    <BarChart3 size={18} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">다음 주 예상 총 주문량</span>
                </div>
                <p className="mt-3 text-3xl font-bold text-gray-900">{totalNextWeek.toLocaleString()}<span className="text-lg font-medium text-gray-400">건</span></p>
              </div>

              {/* Rising */}
              {risingProduct && (
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 shadow-sm">
                      <TrendingUp size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">가장 높은 성장</span>
                  </div>
                  <p className="mt-3 text-lg font-bold text-gray-900">{risingProduct.product_name}</p>
                  <p className="text-sm font-semibold text-green-600">+{risingProduct.change_percent}%</p>
                </div>
              )}

              {/* Declining */}
              {decliningProduct && decliningProduct.change_percent < 0 && (
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 shadow-sm">
                      <AlertTriangle size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">재고 주의</span>
                  </div>
                  <p className="mt-3 text-lg font-bold text-gray-900">{decliningProduct.product_name}</p>
                  <p className="text-sm font-semibold text-red-500">{decliningProduct.change_percent}%</p>
                </div>
              )}
              {decliningProduct && decliningProduct.change_percent >= 0 && (
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700 shadow-sm">
                      <TrendingDown size={18} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-500">가장 낮은 변화</span>
                  </div>
                  <p className="mt-3 text-lg font-bold text-gray-900">{decliningProduct.product_name}</p>
                  <p className="text-sm font-semibold text-gray-500">{decliningProduct.change_percent}%</p>
                </div>
              )}
            </motion.div>

            {/* AI Insight */}
            {aiInsight && <AiInsightCard insight={aiInsight} />}

            {/* View Toggle */}
            <div className="mt-8 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">상품별 예측</h2>
              <div className="inline-flex rounded-xl bg-gray-100 p-1" role="radiogroup" aria-label="보기 방식">
                <button
                  onClick={() => setView("chart")}
                  role="radio"
                  aria-checked={view === "chart"}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                    view === "chart" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {view === "chart" && (
                    <motion.div layoutId="viewToggle" className="absolute inset-0 rounded-lg bg-primary-700" />
                  )}
                  <BarChart3 size={14} className="relative z-10" />
                  <span className="relative z-10">차트</span>
                </button>
                <button
                  onClick={() => setView("table")}
                  role="radio"
                  aria-checked={view === "table"}
                  className={`relative flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                    view === "table" ? "text-white" : "text-gray-500"
                  }`}
                >
                  {view === "table" && (
                    <motion.div layoutId="viewToggle" className="absolute inset-0 rounded-lg bg-primary-700" />
                  )}
                  <Table2 size={14} className="relative z-10" />
                  <span className="relative z-10">테이블</span>
                </button>
              </div>
            </div>

            {/* Content */}
            {view === "chart" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-5"
              >
                {forecasts.map((f, i) => (
                  <motion.div
                    key={f.product_id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">{f.product_name}</h3>
                      <span className="text-xs text-gray-400">{f.category}</span>
                    </div>
                    <ForecastChart data={f.forecast} color={CHART_COLORS[i % CHART_COLORS.length]} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
                <ForecastTable forecasts={forecasts} />
              </motion.div>
            )}

            {/* Methodology */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 rounded-xl bg-primary-50 border border-primary-100 p-4"
            >
              <p className="text-xs text-primary-700">
                이 예측은 최근 4주간의 주문 데이터와 계절성 패턴을 기반으로 생성됩니다. 실제 수요와 차이가 있을 수 있습니다.
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
