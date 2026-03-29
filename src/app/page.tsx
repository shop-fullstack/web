"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { dummyProducts, categories } from "@/lib/dummy-data";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const trendItems = [
  { name: "일회용 종이컵 1000개입", change: 32 },
  { name: "업소용 위생장갑 (L) 100매", change: 29 },
  { name: "아메리카노 원두 1kg", change: 21 },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section
        className="flex h-80 flex-col justify-center gap-4 pl-20"
        style={{
          background: "linear-gradient(to bottom, var(--primary-900), #1A3A6B)",
        }}
      >
        <motion.h1
          className="text-[32px] font-bold text-white"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
        >
          소상공인의 스마트 매입, 비즈마트
        </motion.h1>
        <motion.p
          className="text-base text-white/60"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          업종별 트렌드 분석으로 잘 팔리는 상품을 먼저 만나세요
        </motion.p>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/products"
            className="inline-flex h-12 items-center rounded-lg bg-white px-7 font-semibold text-primary-700 transition-opacity hover:opacity-90"
          >
            상품 둘러보기
          </Link>
        </motion.div>
      </section>

      {/* Trend Banner Section */}
      <motion.section
        className="bg-primary-100 px-20 py-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 text-xl font-bold text-primary-700">
          이번 주 트렌드
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {trendItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-lg bg-white p-4"
            >
              <span className="text-sm font-medium text-gray-900">
                {item.name}
              </span>
              <span className="text-sm font-semibold text-success">
                ▲ {item.change}%
              </span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Category Section */}
      <motion.section
        className="px-20 py-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <div className="grid grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.label}
              href={`/products?category=${cat.label}`}
              className="flex h-20 flex-col items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-sm font-medium text-gray-900">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* Recommended Products Section */}
      <motion.section
        className="px-20 pb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">추천 상품</h2>
          <Link
            href="/products"
            className="text-sm font-medium text-primary-500 hover:underline"
          >
            더보기
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {dummyProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </motion.section>
    </div>
  );
}
