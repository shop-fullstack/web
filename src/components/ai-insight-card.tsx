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
      className={`relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-violet-50/60 to-purple-50/40 p-5 ${className}`}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-indigo-100/40 blur-2xl" />
      <div className="relative flex gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-sm shadow-indigo-200/50">
          <Sparkles size={14} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">AI 분석</p>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-700">{insight}</p>
        </div>
      </div>
    </motion.div>
  );
}
