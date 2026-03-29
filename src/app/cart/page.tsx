"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, X } from "lucide-react";
import { Header } from "@/components/header";
import { useCartStore } from "@/store/cart-store";

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

      <div className="mx-auto max-w-layout px-12 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">장바구니</h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 text-lg mb-6">
              장바구니가 비어있습니다.
            </p>
            <Link
              href="/products"
              className="rounded-lg bg-primary-700 px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              상품 둘러보기
            </Link>
          </div>
        ) : (
          <div className="flex gap-8">
            {/* Cart items - left column */}
            <div className="flex-1">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white border-b border-gray-200 p-5 flex items-start gap-5"
                >
                  {/* Product image */}
                  <div className="w-20 h-20 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[16px] font-semibold text-gray-900">
                        {item.product.name}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-700">
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
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Price + delete */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <X size={18} />
                    </button>
                    <span className="text-[16px] font-bold text-gray-900 whitespace-nowrap">
                      {(item.product.price_per_box * item.quantity).toLocaleString()}원
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary - right column */}
            <div className="w-[380px] flex-shrink-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  주문 요약
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">상품수</span>
                    <span className="text-gray-900">{itemCount}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">상품금액</span>
                    <span className="text-gray-900">
                      {totalAmount().toLocaleString()}원
                    </span>
                  </div>
                </div>

                <div className="my-4 border-t border-gray-200" />

                <div className="flex justify-between items-center mb-6">
                  <span className="text-base font-bold text-gray-900">
                    총 결제금액
                  </span>
                  <span className="text-xl font-bold text-primary-700">
                    {totalAmount().toLocaleString()}원
                  </span>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full h-12 rounded-lg bg-primary-700 text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  결제하기
                </button>

                <Link
                  href="/products"
                  className="mt-3 flex h-12 w-full items-center justify-center rounded-lg border border-gray-200 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  쇼핑 계속하기
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
