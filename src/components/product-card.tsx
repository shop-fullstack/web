"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Image placeholder */}
      <Link href={`/products/${product.id}`}>
        <div className="flex h-[200px] items-center justify-center bg-gray-200">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Package size={48} className="text-gray-500" />
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Category badge */}
        <span className="w-fit rounded bg-primary-100 px-2.5 py-1 text-xs font-medium text-primary-700">
          {product.category}
        </span>

        {/* Product name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-[15px] font-semibold text-gray-900 hover:underline">
            {product.name}
          </h3>
        </Link>

        {/* Price area */}
        <div className="mt-auto flex flex-col gap-0.5">
          <span className="text-sm text-gray-500 line-through">
            {product.unit_price.toLocaleString()}원
          </span>
          <span className="font-bold text-primary-700">
            {product.unit} {product.price.toLocaleString()}원
          </span>
        </div>

        {/* Add to cart button */}
        <button
          type="button"
          onClick={() => addItem(product, 1)}
          className="mt-1 flex h-10 w-full items-center justify-center rounded-lg border border-primary-700 bg-white text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-100"
        >
          담기
        </button>
      </div>
    </div>
  );
}
