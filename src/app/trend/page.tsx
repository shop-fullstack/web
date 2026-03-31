"use client";

import { motion } from "framer-motion";
import { TrendingUp, BarChart3, Users, ShoppingBag, Loader2, Calendar } from "lucide-react";
import { Header } from "@/components/header";
import { AiInsightCard } from "@/components/ai-insight-card";
import { useTrendReport } from "@/lib/queries";
import type { TrendRankItem } from "@/types";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function getChangeIndicator(change: TrendRankItem["change"]) {
  switch (change) {
    case "up":
      return <span className="text-emerald-500 font-semibold">▲</span>;
    case "down":
      return <span className="text-red-500 font-semibold">▼</span>;
    case "same":
      return <span className="text-gray-400">—</span>;
    case "new":
      return (
        <span className="rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 px-2 py-0.5 text-[10px] font-bold text-white tracking-wide">
          NEW
        </span>
      );
  }
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-bold text-white shadow-md shadow-amber-200/50">
        {rank}
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-300 to-slate-400 text-xs font-bold text-white shadow-md shadow-slate-200/50">
        {rank}
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-700 text-xs font-bold text-white shadow-md shadow-amber-200/50">
        {rank}
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 items-center justify-center text-sm font-semibold text-gray-400">
      {rank}
    </span>
  );
}

const statsConfig = [
  {
    icon: ShoppingBag,
    label: "최근 인기 상품",
    gradient: "from-blue-500 to-indigo-500",
    bgGradient: "from-blue-50 to-indigo-50",
  },
  {
    icon: TrendingUp,
    label: "급상승 상품",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
  },
  {
    icon: BarChart3,
    label: "카테고리 구분 상품",
    gradient: "from-violet-500 to-purple-500",
    bgGradient: "from-violet-50 to-purple-50",
  },
  {
    icon: Users,
    label: "누적 구매자",
    gradient: "from-orange-500 to-rose-500",
    bgGradient: "from-orange-50 to-rose-50",
  },
];

const barGradients = [
  "from-blue-500 to-indigo-500",
  "from-violet-500 to-purple-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-rose-500 to-pink-500",
  "from-cyan-500 to-sky-500",
];

export default function TrendReportPage() {
  const { data, isLoading } = useTrendReport("weekly");
  const ranking: TrendRankItem[] = data?.data?.ranking || [];
  const aiInsight = data?.data?.ai_insight;

  const topProduct = ranking[0];
  const risingProduct = ranking.find((item) => item.change === "up");
  const uniqueCategories = new Set(ranking.map((item) => item.category)).size;

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

  const statsData = [
    {
      value: topProduct?.name ?? "---",
      sub: topProduct ? `${topProduct.order_count.toLocaleString()}건 주문` : "데이터 없음",
    },
    {
      value: risingProduct?.name ?? "---",
      sub: risingProduct ? "급상승 중" : "",
    },
    {
      value: `${uniqueCategories}개`,
      sub: "",
    },
    {
      value: `${ranking.reduce((sum, item) => sum + item.order_count, 0).toLocaleString()}명`,
      sub: "",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      <main className="mx-auto max-w-layout px-20 py-10 flex flex-col gap-8">
        {/* Title section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              트렌드 리포트
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              실시간 주문 데이터 기반 소상공인 트렌드 분석
            </p>
          </div>
          {data?.data?.generated_at && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-medium text-gray-600 shadow-sm border border-gray-100">
              <Calendar size={13} className="text-gray-400" />
              {new Date(data.data.generated_at).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
          </div>
        ) : (
          <>
            {/* Stats row */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-4 gap-5"
            >
              {statsConfig.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    variants={itemVariants}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={`rounded-2xl bg-gradient-to-br ${stat.bgGradient} p-5 border border-white/60 shadow-sm hover:shadow-md transition-shadow cursor-default`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-sm`}>
                        <Icon size={15} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{stat.label}</span>
                    </div>
                    <p className="mt-3 text-lg font-bold text-gray-900 truncate">
                      {statsData[i].value}
                    </p>
                    {statsData[i].sub && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        {i === 1 && risingProduct ? (
                          <span className="text-emerald-600 font-medium">▲ {statsData[i].sub}</span>
                        ) : (
                          statsData[i].sub
                        )}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* AI Insight */}
            {aiInsight && <AiInsightCard insight={aiInsight} />}

            {/* Two-column layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* Left: TOP 10 table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-base font-bold text-gray-900">
                    TOP 10 인기 상품
                  </h2>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-3 text-left font-medium">순위</th>
                      <th className="px-6 py-3 text-left font-medium">상품명</th>
                      <th className="px-6 py-3 text-center font-medium">변동</th>
                      <th className="px-6 py-3 text-right font-medium">판매량</th>
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {ranking.slice(0, 10).map((item) => (
                      <motion.tr
                        key={item.rank}
                        variants={rowVariants}
                        className="border-b border-gray-50 last:border-b-0 transition-colors hover:bg-gray-50/80 group"
                      >
                        <td className="px-6 py-4">
                          <RankBadge rank={item.rank} />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800 group-hover:text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 text-center text-sm">
                          {getChangeIndicator(item.change)}
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                          {item.order_count.toLocaleString()}건
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </motion.div>

              {/* Right: Category distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6"
              >
                <h2 className="text-base font-bold text-gray-900">
                  카테고리별 판매 현황
                </h2>
                <div className="mt-8 flex flex-col gap-6">
                  {categoryDistribution.map((cat, i) => (
                    <div key={cat.category} className="flex items-center gap-4">
                      <span className="w-16 shrink-0 text-sm font-medium text-gray-700">
                        {cat.category}
                      </span>
                      <div className="relative flex-1 h-7">
                        <div className="absolute inset-0 rounded-full bg-gray-100" />
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: "easeOut" as const }}
                          className={`absolute left-0 top-0 h-7 rounded-full bg-gradient-to-r ${barGradients[i % barGradients.length]} shadow-sm`}
                        />
                      </div>
                      <span className="w-12 shrink-0 text-right text-sm font-bold text-gray-700">
                        {cat.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
