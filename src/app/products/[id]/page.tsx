"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Minus, Plus, ChevronRight, ShoppingBag, Zap, Package, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { useProduct } from "@/lib/queries";
import { useCartStore } from "@/store/cart-store";
import { getCategoryVisual } from "@/lib/product-visuals";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { data, isLoading, isError } = useProduct(params.id);
  const product = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
        <Header />
        <div className="mx-auto max-w-layout px-4 md:px-8 lg:px-20 py-10">
          {/* Breadcrumb skeleton */}
          <div className="mb-8 flex items-center gap-2">
            <div className="h-4 w-12 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-4 w-3 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-16 animate-pulse rounded-lg bg-gray-200" />
            <div className="h-4 w-3 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-32 animate-pulse rounded-lg bg-gray-200" />
          </div>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
            {/* Left skeleton */}
            <div className="flex-1">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="relative aspect-square overflow-hidden rounded-xl bg-gray-100"
                  >
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  </div>
                ))}
              </div>
            </div>
            {/* Right skeleton */}
            <div className="flex flex-1 flex-col gap-5">
              <div className="relative h-5 w-32 overflow-hidden rounded-lg bg-gray-100">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
              <div className="relative h-8 w-72 overflow-hidden rounded-lg bg-gray-100">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
              <div className="relative mt-2 h-32 overflow-hidden rounded-2xl bg-gray-100">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
              <div className="relative mt-2 h-12 w-48 overflow-hidden rounded-xl bg-gray-100">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
              <div className="relative h-16 overflow-hidden rounded-lg bg-gray-100">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              </div>
              <div className="mt-2 flex gap-3">
                <div className="relative h-14 flex-1 overflow-hidden rounded-2xl bg-gray-100">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
                <div className="relative h-14 flex-1 overflow-hidden rounded-2xl bg-gray-100">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-40">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <Package size={40} className="text-gray-300" />
          </div>
          <p className="mt-5 text-lg font-semibold text-gray-900">
            상품을 찾을 수 없습니다
          </p>
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="mt-5 rounded-xl bg-primary-700 hover:bg-primary-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all"
          >
            상품 목록으로
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = product.price_per_box * quantity;

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <Header />

      <div className="mx-auto max-w-layout px-4 md:px-8 lg:px-20 py-10">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 flex items-center gap-1.5 text-sm"
        >
          <Link
            href="/"
            className="text-gray-400 transition-colors hover:text-primary-700"
          >
            홈
          </Link>
          <ChevronRight size={14} className="text-gray-300" />
          <Link
            href="/products"
            className="text-gray-400 transition-colors hover:text-primary-700"
          >
            상품
          </Link>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-gray-400">{product.category}</span>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="font-medium text-gray-700 line-clamp-1 max-w-[300px]">
            {product.name}
          </span>
        </motion.nav>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
          {/* Left column - Images */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex-1"
          >
            {/* Main image */}
            {(() => {
              const visual = getCategoryVisual(product.category);
              return (
                <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${visual.gradient} shadow-sm ring-1 ring-gray-100`}>
                  <span className="text-[120px] drop-shadow-sm">{visual.emoji}</span>
                </div>
              );
            })()}

            {/* Thumbnail row */}
            {(() => {
              const visual = getCategoryVisual(product.category);
              const angles = ["from-tl", "from-tr", "from-bl", "from-br"];
              return (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {angles.map((_, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                      className={`flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${visual.gradient} transition-all duration-200 ${
                        i === 0
                          ? "ring-2 ring-primary-700 ring-offset-2"
                          : "opacity-60 ring-1 ring-gray-200 hover:opacity-90 hover:ring-gray-300"
                      }`}
                    >
                      <span className="text-3xl">{visual.emoji}</span>
                    </motion.div>
                  ))}
                </div>
              );
            })()}
          </motion.div>

          {/* Right column - Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
            className="flex flex-1 flex-col"
          >
            {/* Category badge */}
            <span className="w-fit rounded-full bg-primary-100/80 px-3.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
              {product.category}
            </span>

            {/* Product name */}
            <h1 className="mt-3 text-2xl font-bold leading-tight text-gray-900">
              {product.name}
            </h1>

            {/* Price box */}
            <div className="mt-6 rounded-2xl bg-primary-50 p-5 ring-1 ring-primary-100/50">
              {product.price_per_unit !== product.price_per_box && (
                <p className="text-sm text-gray-400 line-through">
                  개당 단가: {product.price_per_unit.toLocaleString()}원
                </p>
              )}
              <p className="mt-1.5 text-2xl font-bold text-primary-700">
                박스 {product.price_per_box.toLocaleString()}
                <span className="text-lg font-semibold">원</span>
              </p>
              <p className="mt-2 text-sm text-gray-500">
                최소주문수량(MOQ): <span className="font-semibold text-gray-700">{product.moq}박스</span>
              </p>
            </div>

            {/* Quantity selector */}
            <div className="mt-6 flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-900">수량</span>
              <div className="flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <motion.button
                  type="button"
                  onClick={handleDecrease}
                  aria-label="수량 감소"
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
                  whileTap={{ scale: 0.92 }}
                  className="flex h-11 w-11 items-center justify-center text-gray-500 transition-colors disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </motion.button>
                <span className="flex h-11 w-14 items-center justify-center border-x border-gray-200 text-sm font-bold text-gray-900">
                  {quantity}
                </span>
                <motion.button
                  type="button"
                  onClick={handleIncrease}
                  aria-label="수량 증가"
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
                  whileTap={{ scale: 0.92 }}
                  className="flex h-11 w-11 items-center justify-center text-gray-500 transition-colors"
                >
                  <Plus size={16} />
                </motion.button>
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6">
              <span className="text-sm font-medium text-gray-500">총 상품 금액</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-gray-900">
                  {totalPrice.toLocaleString()}
                </span>
                <span className="text-lg font-semibold text-gray-500">원</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex gap-3">
              <motion.button
                type="button"
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex h-14 flex-1 items-center justify-center gap-2 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                  added
                    ? "border-primary-300 bg-primary-50 text-primary-700"
                    : "border-primary-200 bg-white text-primary-700 hover:border-primary-300 hover:bg-primary-50 hover:shadow-sm"
                }`}
              >
                <AnimatePresence mode="wait">
                  {added ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={18} />
                      담았습니다
                    </motion.span>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingBag size={18} />
                      장바구니 담기
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <motion.button
                type="button"
                onClick={handleBuyNow}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-xl bg-primary-700 hover:bg-primary-600 text-sm font-semibold text-white shadow-sm transition-all duration-200"
              >
                <Zap size={18} />
                바로 구매
              </motion.button>
            </div>

            {/* Specs table */}
            <div className="mt-10 overflow-hidden rounded-2xl ring-1 ring-gray-100">
              <table className="w-full text-sm">
                <thead className="sr-only">
                  <tr>
                    <th>항목</th>
                    <th>내용</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="w-[130px] bg-gray-50/80 px-5 py-3.5 font-semibold text-gray-500">
                      카테고리
                    </td>
                    <td className="px-5 py-3.5 text-gray-900">
                      {product.category}
                    </td>
                  </tr>
                  <tr className="border-t border-gray-100">
                    <td className="bg-gray-50/80 px-5 py-3.5 font-semibold text-gray-500">
                      최소주문수량
                    </td>
                    <td className="px-5 py-3.5 text-gray-900">
                      {product.moq}박스
                    </td>
                  </tr>
                  {product.origin && (
                    <tr className="border-t border-gray-100">
                      <td className="bg-gray-50/80 px-5 py-3.5 font-semibold text-gray-500">
                        원산지
                      </td>
                      <td className="px-5 py-3.5 text-gray-900">
                        {product.origin}
                      </td>
                    </tr>
                  )}
                  {product.expiry_info && (
                    <tr className="border-t border-gray-100">
                      <td className="bg-gray-50/80 px-5 py-3.5 font-semibold text-gray-500">
                        유통기한
                      </td>
                      <td className="px-5 py-3.5 text-gray-900">
                        {product.expiry_info}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
