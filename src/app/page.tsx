"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { useProducts, useTrendReport } from "@/lib/queries";

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const categories = [
  { label: "식자재", icon: "🍳" },
  { label: "소모품", icon: "🧴" },
  { label: "포장재", icon: "📦" },
  { label: "뷰티용품", icon: "💄" },
  { label: "인테리어", icon: "🪑" },
  { label: "기타", icon: "📋" },
];

function getChangeIndicator(change: "up" | "down" | "same" | "new") {
  switch (change) {
    case "up":
      return { label: "▲", className: "text-success" };
    case "down":
      return { label: "▼", className: "text-error" };
    case "same":
      return { label: "—", className: "text-gray-400" };
    case "new":
      return { label: "NEW", className: "text-primary-500 font-bold" };
  }
}

export default function Home() {
  const { data: productsData, isLoading: productsLoading, isError: productsError, refetch: refetchProducts } = useProducts({
    sort: "popular",
    limit: 4,
  });
  const { data: trendData, isLoading: trendLoading } = useTrendReport("weekly", 3);

  const products = productsData?.data?.items || [];
  const trendRanking = trendData?.data?.ranking || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary-700">
        <div className="relative mx-auto max-w-layout px-4 md:px-8 lg:px-20 py-24 md:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-2xl"
          >
            <motion.div
              variants={fadeUp}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white/90"
            >
              <Sparkles size={14} />
              AI 기반 트렌드 분석 플랫폼
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl"
            >
              소상공인의
              <br />
              <span className="text-primary-100">
                스마트 매입
              </span>
              , 비즈마트
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-5 text-lg leading-relaxed text-white/60"
            >
              업종별 트렌드 분석으로 잘 팔리는 상품을 먼저 만나세요.
              <br />
              데이터 기반 매입으로 매출을 높이세요.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 font-semibold text-primary-700 shadow transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                상품 둘러보기
                <ArrowRight
                  size={18}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/trend"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/20 px-8 py-4 font-semibold text-white transition-all duration-300 hover:border-white/40 hover:bg-white/10"
              >
                트렌드 보기
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trend Banner Section */}
      <motion.section
        className="relative -mt-6 mx-auto max-w-layout px-4 md:px-8 lg:px-20"
        initial="hidden"
        animate={!trendLoading ? "visible" : "hidden"}
        variants={stagger}
      >
        <motion.div
          variants={fadeUp}
          className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-700">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">이번 주 트렌드</h2>
              <p className="text-xs text-gray-500">실시간 주문 데이터 기반</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {trendLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex animate-pulse items-center justify-between rounded-xl bg-gray-50 p-5"
                  >
                    <div className="h-4 w-40 rounded bg-gray-200" />
                    <div className="h-4 w-16 rounded bg-gray-200" />
                  </div>
                ))
              : trendRanking.map((item, index) => {
                  const indicator = getChangeIndicator(item.change);
                  return (
                    <motion.div
                      key={item.product_id}
                      variants={scaleIn}
                      className="group flex items-center justify-between rounded-xl bg-gradient-to-r from-gray-50 to-white p-5 ring-1 ring-gray-100 transition-all duration-300 hover:ring-primary-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-700 text-xs font-bold text-white">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold ${indicator.className}`}>
                          {indicator.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {item.order_count.toLocaleString()}건
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
          </div>
        </motion.div>
      </motion.section>

      {/* Category Section */}
      <motion.section
        className="mx-auto max-w-layout px-4 md:px-8 lg:px-20 py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">카테고리</h2>
          <p className="mt-2 text-sm text-gray-500">업종에 맞는 상품을 찾아보세요</p>
        </motion.div>
        <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
          {categories.map((cat) => (
            <motion.div key={cat.label} variants={scaleIn}>
              <Link
                href={`/products?category=${cat.label}`}
                className="group flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm hover:border-primary-200"
              >
                <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
                  {cat.icon}
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {cat.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Recommended Products Section */}
      <motion.section
        className="mx-auto max-w-layout px-4 md:px-8 lg:px-20 pb-20"
        initial="hidden"
        animate={!productsLoading ? "visible" : "hidden"}
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">추천 상품</h2>
            <p className="mt-1 text-sm text-gray-500">
              가장 많이 주문된 인기 상품
            </p>
          </div>
          <Link
            href="/products"
            className="group flex items-center gap-1 text-sm font-semibold text-primary-500 transition-colors hover:text-primary-700"
          >
            전체보기
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
        {productsError && !productsLoading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white py-16">
            <p className="text-gray-500">상품을 불러오지 못했습니다</p>
            <p className="mt-1 text-sm text-gray-400">서버가 준비 중일 수 있습니다</p>
            <button
              type="button"
              onClick={() => refetchProducts()}
              className="mt-4 rounded-xl bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {productsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
                    variants={scaleIn}
                    className="animate-pulse overflow-hidden rounded-2xl border border-gray-100 bg-white"
                  >
                    <div className="h-[200px] bg-gradient-to-br from-gray-100 to-gray-50" />
                    <div className="flex flex-col gap-3 p-5">
                      <div className="h-4 w-16 rounded-full bg-gray-100" />
                      <div className="h-5 w-3/4 rounded bg-gray-100" />
                      <div className="h-5 w-1/2 rounded bg-gray-100" />
                      <div className="h-11 rounded-xl bg-gray-100" />
                    </div>
                  </motion.div>
                ))
              : products.map((product) => (
                  <motion.div key={product.id} variants={scaleIn}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
          </div>
        )}
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto flex max-w-layout items-center justify-between px-4 md:px-8 lg:px-20 py-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-700 text-[10px] font-bold text-white">
              B
            </div>
            <span className="text-sm font-bold text-gray-900">비즈마트</span>
          </div>
          <p className="text-xs text-gray-500">
            © 2026 BizMart. 포트폴리오 프로젝트입니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
