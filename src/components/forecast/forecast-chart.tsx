"use client";

import { motion } from "framer-motion";
import type { ForecastDataPoint } from "@/types";

interface ForecastChartProps {
  data: ForecastDataPoint[];
  color?: string;
  height?: number;
}

export function ForecastChart({ data, color = "from-primary-700 to-primary-500", height = 200 }: ForecastChartProps) {
  const maxVal = Math.max(...data.map((d) => d.confidence_high), 1);

  return (
    <div className="flex items-end gap-3" style={{ height }} role="img" aria-label="수요 예측 차트">
      {data.map((dp, i) => {
        const barH = (dp.predicted_orders / maxVal) * height;
        const highH = (dp.confidence_high / maxVal) * height;

        return (
          <div key={dp.week_label} className="group relative flex flex-1 flex-col items-center">
            {/* Tooltip */}
            <div className="pointer-events-none absolute -top-16 z-10 hidden rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
              <p className="font-semibold">{dp.predicted_orders}건</p>
              <p className="text-gray-400">{dp.confidence_low}~{dp.confidence_high}</p>
            </div>

            {/* Confidence range */}
            <div className="relative w-full flex justify-center" style={{ height }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: highH }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                className="absolute bottom-0 w-full max-w-[48px] rounded-t-lg bg-gray-100"
              />
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: barH }}
                transition={{ duration: 0.8, delay: i * 0.1 + 0.1, type: "spring", bounce: 0.2 }}
                className={`absolute bottom-0 w-full max-w-[48px] rounded-t-lg bg-gradient-to-t ${color} shadow-sm`}
              />
            </div>

            {/* Label */}
            <span className="mt-2 text-[11px] font-medium text-gray-400 text-center leading-tight">
              {dp.week_label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
