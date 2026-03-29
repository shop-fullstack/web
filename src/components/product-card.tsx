"use client";

import Link from "next/link";
import { Package, ShoppingBag, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-gray-200/50"
    >
      {/* Image */}
      <Link href={`/products/${product.id}`} className="relative overflow-hidden">
        <div className="flex h-[200px] items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 transition-transform duration-500 group-hover:scale-105">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Package size={40} className="text-gray-300" />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        {/* Category badge */}
        <span className="w-fit rounded-full bg-primary-100/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-700">
          {product.category}
        </span>

        {/* Product name */}
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-2 h-[2.6rem] text-[15px] font-semibold leading-snug text-gray-900 transition-colors group-hover:text-primary-700">
            {product.name}
          </h3>
        </Link>

        {/* Price area */}
        <div className="mt-auto flex flex-col gap-0.5 pt-1">
          {product.price_per_unit !== product.price_per_box && (
            <span className="text-xs text-gray-400 line-through">
              {product.price_per_unit.toLocaleString()}원
            </span>
          )}
          <span className="text-lg font-bold text-primary-700">
            {product.price_per_box.toLocaleString()}
            <span className="text-sm font-medium text-gray-500">원</span>
          </span>
        </div>

        {/* Add to cart button */}
        <motion.button
          type="button"
          onClick={handleAdd}
          whileTap={{ scale: 0.97 }}
          className={`mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
            added
              ? "border-2 border-success bg-success-light text-success"
              : "border-2 border-primary-700/20 bg-primary-700/5 text-primary-700 hover:border-primary-700 hover:bg-primary-700 hover:text-white"
          }`}
        >
          <AnimatePresence mode="wait">
            {added ? (
              <motion.span
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1.5"
              >
                <Check size={16} /> 담았습니다
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1.5"
              >
                <ShoppingBag size={16} /> 담기
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
}
