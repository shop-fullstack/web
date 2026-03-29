"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Package } from "lucide-react";
import { Header } from "@/components/header";
import { useProduct } from "@/lib/queries";
import { useCartStore } from "@/store/cart-store";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  const { data, isLoading, isError } = useProduct(params.id);
  const product = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="mx-auto max-w-layout px-20 py-10">
          <div className="flex gap-12">
            {/* Left skeleton */}
            <div className="flex-1">
              <div className="aspect-square animate-pulse rounded-lg bg-gray-200" />
              <div className="mt-4 grid grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="aspect-square animate-pulse rounded-lg bg-gray-200"
                  />
                ))}
              </div>
            </div>
            {/* Right skeleton */}
            <div className="flex flex-1 flex-col gap-4">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
              <div className="h-7 w-64 animate-pulse rounded bg-gray-200" />
              <div className="mt-4 h-28 animate-pulse rounded-lg bg-gray-200" />
              <div className="mt-4 h-10 w-48 animate-pulse rounded bg-gray-200" />
              <div className="mt-4 h-16 animate-pulse rounded bg-gray-200" />
              <div className="mt-4 flex gap-3">
                <div className="h-12 flex-1 animate-pulse rounded-lg bg-gray-200" />
                <div className="h-12 flex-1 animate-pulse rounded-lg bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex flex-col items-center justify-center py-40">
          <p className="text-lg font-medium text-gray-900">
            상품을 찾을 수 없습니다
          </p>
          <button
            type="button"
            onClick={() => router.push("/products")}
            className="mt-4 rounded-lg bg-primary-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-900"
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
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    router.push("/cart");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-layout px-20 py-10">
        <div className="flex gap-12">
          {/* Left column - Images */}
          <div className="flex-1">
            {/* Main image */}
            <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-200">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <Package size={80} className="text-gray-500" />
              )}
            </div>

            {/* Thumbnail row */}
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex aspect-square items-center justify-center rounded-lg bg-gray-200 ${
                    i === 0
                      ? "ring-2 ring-primary-700"
                      : "opacity-60"
                  }`}
                >
                  {i === 0 && product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    <Package
                      size={24}
                      className="text-gray-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right column - Info */}
          <div className="flex flex-1 flex-col">
            {/* Breadcrumb */}
            <p className="text-sm text-gray-500">
              {product.category}
            </p>

            {/* Product name */}
            <h1 className="mt-2 text-[22px] font-bold text-gray-900">
              {product.name}
            </h1>

            {/* Price box */}
            <div className="mt-6 rounded-lg bg-primary-100 p-4">
              {product.price_per_unit !== product.price_per_box && (
                <p className="text-sm text-gray-500 line-through">
                  개당 단가: {product.price_per_unit.toLocaleString()}원
                </p>
              )}
              <p className="mt-1 text-xl font-bold text-primary-700">
                박스 {product.price_per_box.toLocaleString()}원
              </p>
              <p className="mt-1 text-sm text-gray-500">
                최소주문수량(MOQ): {product.moq}박스
              </p>
            </div>

            {/* Quantity selector */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-sm font-medium text-gray-900">수량</span>
              <div className="flex items-center rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="flex h-10 w-10 items-center justify-center text-gray-500 hover:bg-gray-200 disabled:opacity-40"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="flex h-10 w-12 items-center justify-center border-x border-gray-200 text-sm font-medium text-gray-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="flex h-10 w-10 items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Total */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-6">
              <span className="text-sm text-gray-500">총 상품 금액</span>
              <span className="text-2xl font-bold text-gray-900">
                {totalPrice.toLocaleString()}원
              </span>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex h-12 flex-1 items-center justify-center rounded-lg border border-primary-700 bg-white text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100"
              >
                장바구니 담기
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex h-12 flex-1 items-center justify-center rounded-lg bg-primary-700 text-sm font-semibold text-white transition-colors hover:bg-primary-900"
              >
                바로 구매
              </button>
            </div>

            {/* Specs table */}
            <div className="mt-8 rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="w-[120px] bg-gray-50 px-4 py-3 font-medium text-gray-500">
                      카테고리
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {product.category}
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="bg-gray-50 px-4 py-3 font-medium text-gray-500">
                      최소주문수량
                    </td>
                    <td className="px-4 py-3 text-gray-900">
                      {product.moq}박스
                    </td>
                  </tr>
                  {product.origin && (
                    <tr className="border-b border-gray-200">
                      <td className="bg-gray-50 px-4 py-3 font-medium text-gray-500">
                        원산지
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {product.origin}
                      </td>
                    </tr>
                  )}
                  {product.expiry_info && (
                    <tr>
                      <td className="bg-gray-50 px-4 py-3 font-medium text-gray-500">
                        유통기한
                      </td>
                      <td className="px-4 py-3 text-gray-900">
                        {product.expiry_info}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
