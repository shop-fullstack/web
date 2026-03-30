"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import type { ProductForecast } from "@/types";

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function TrendBadge({ trend, change }: { trend: ProductForecast["trend"]; change: number }) {
  if (trend === "rising") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
        <TrendingUp size={12} /> +{change}%
      </span>
    );
  }
  if (trend === "declining") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-500">
        <TrendingDown size={12} /> {change}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
      <Minus size={12} /> {change}%
    </span>
  );
}

export function ForecastTable({ forecasts }: { forecasts: ProductForecast[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80">
            <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">상품명</th>
            <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">카테고리</th>
            <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">현재 평균</th>
            <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">4주 예측</th>
            <th className="px-6 py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">추세</th>
          </tr>
        </thead>
        <motion.tbody initial="hidden" animate="visible" transition={{ staggerChildren: 0.06 }}>
          {forecasts.map((f) => {
            const avgForecast = Math.round(
              f.forecast.reduce((s, d) => s + d.predicted_orders, 0) / f.forecast.length
            );
            return (
              <motion.tr
                key={f.product_id}
                variants={rowVariants}
                className="border-b border-gray-50 transition-colors hover:bg-gray-50/60"
              >
                <td className="px-6 py-4 font-medium text-gray-900">{f.product_name}</td>
                <td className="px-4 py-4">
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                    {f.category}
                  </span>
                </td>
                <td className="px-4 py-4 text-right font-medium text-gray-700">
                  {f.current_weekly_avg}건/주
                </td>
                <td className="px-4 py-4 text-right font-semibold text-gray-900">
                  {avgForecast}건/주
                </td>
                <td className="px-6 py-4 text-center">
                  <TrendBadge trend={f.trend} change={f.change_percent} />
                </td>
              </motion.tr>
            );
          })}
        </motion.tbody>
      </table>
    </div>
  );
}
