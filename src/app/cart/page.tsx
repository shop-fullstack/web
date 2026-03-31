"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { useCartStore } from "@/store/cart-store";
import { getCategoryVisual } from "@/lib/product-visuals";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: "easeOut" as const },
  }),
  exit: {
    opacity: 0,
    x: -60,
    transition: { duration: 0.3, ease: "easeIn" as const },
  },
};

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalAmount = useCartStore((s) => s.totalAmount);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-layout px-4 md:px-8 lg:px-12 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold text-gray-900 mb-8"
        >
          장바구니
        </motion.h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-50 mb-6">
              <ShoppingBag size={40} className="text-primary-500" />
            </div>
            <p className="text-gray-900 text-lg font-semibold mb-2">
              장바구니가 비어있습니다
            </p>
            <p className="text-gray-500 text-sm mb-8">
              마음에 드는 상품을 담아보세요
            </p>
            <Link
              href="/products"
              className="rounded-xl bg-primary-700 hover:bg-primary-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200"
            >
              상품 둘러보기
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart items - left column */}
            <div className="flex-1 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 flex items-start gap-5 transition-shadow duration-200 hover:shadow-md"
                  >
                    {/* Product image */}
                    {(() => {
                      const v = getCategoryVisual(item.product.category);
                      return (
                        <div className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${v.gradient}`}>
                          <span className="text-3xl">{v.emoji}</span>
                        </div>
                      );
                    })()}

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/products/${item.product.id}`}
                          className="text-[16px] font-semibold text-gray-900 hover:text-primary-700 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
                          {item.product.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        개당 {item.product.price_per_unit.toLocaleString()}원 / 박스{" "}
                        {item.product.price_per_box.toLocaleString()}원
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                          aria-label="수량 감소"
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-700"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          aria-label="수량 증가"
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-700"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Price + delete */}
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeItem(item.product.id)}
                        aria-label="상품 삭제"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 transition-colors duration-150 hover:bg-red-50 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                      <span className="text-[16px] font-bold text-gray-900 whitespace-nowrap">
                        {(item.product.price_per_box * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order summary - right column */}
            <div className="w-full lg:w-[380px] flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden sticky top-24"
              >
                <div className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    주문 요약
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">상품수</span>
                      <span className="text-gray-900 font-medium">{itemCount}개</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">상품금액</span>
                      <span className="text-gray-900 font-medium">
                        {totalAmount().toLocaleString()}원
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total section */}
                <div className="bg-primary-50 px-6 py-5">
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-base font-bold text-gray-900">
                      총 결제금액
                    </span>
                    <span className="text-xl font-bold text-primary-700">
                      {totalAmount().toLocaleString()}원
                    </span>
                  </div>

                  <button
                    onClick={() => router.push("/checkout")}
                    className="w-full h-12 rounded-xl bg-primary-700 hover:bg-primary-600 text-white font-semibold shadow-sm transition-all duration-200"
                  >
                    결제하기
                  </button>

                  <Link
                    href="/products"
                    className="mt-3 flex h-12 w-full items-center justify-center rounded-xl border border-gray-200 bg-white/80 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-white hover:border-gray-300"
                  >
                    쇼핑 계속하기
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
