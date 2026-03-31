"use client";

import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface AiInsightCardProps {
  insight: string;
  className?: string;
}

export function AiInsightCard({ insight, className = "" }: AiInsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`relative overflow-hidden rounded-2xl border border-primary-100 bg-primary-50 p-5 ${className}`}
    >
      <div className="relative flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary-700 shadow-sm">
          <Sparkles size={14} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-primary-700 tracking-wide uppercase">AI 분석</p>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-700">{insight}</p>
        </div>
      </div>
    </motion.div>
  );
}
