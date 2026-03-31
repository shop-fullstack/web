"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, PackageSearch, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/lib/queries";

const CATEGORIES = ["소모품", "식자재", "포장재", "뷰티용품", "인테리어", "기타"];
const SORT_OPTIONS = [
  { value: "popular", label: "인기순" },
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
  { value: "latest", label: "최신순" },
];

const LIMIT = 20;

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const shimmerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const shimmerItemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") ?? undefined;

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    initialCategory
  );
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, sortBy]);

  const { data, isLoading, isError } = useProducts({
    category: selectedCategory,
    sort: sortBy,
    search: searchQuery || undefined,
    page,
    limit: LIMIT,
  });

  const products = data?.data?.items || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / LIMIT);

  const selectCategory = (category: string) => {
    setSelectedCategory((prev) =>
      prev === category ? undefined : category
    );
  };

  const resetFilters = () => {
    setSelectedCategory(undefined);
    setSearchInput("");
    setSearchQuery("");
    setSortBy("popular");
    setPage(1);
  };

  const hasActiveFilters = selectedCategory || searchInput || sortBy !== "popular";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/80 to-white">
      <Header />

      <div className="mx-auto flex max-w-layout gap-8 px-8 py-8">
        {/* Sidebar */}
        <aside className="hidden lg:block lg:w-[260px] shrink-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" as const }}
            className="sticky top-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-primary-700" />
                <h2 className="text-lg font-bold text-gray-900">필터</h2>
              </div>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-500 transition-all hover:bg-gray-100 hover:text-primary-700"
                >
                  <RotateCcw size={12} />
                  초기화
                </motion.button>
              )}
            </div>

            {/* Divider */}
            <div className="my-5 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Category filter */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-tight text-gray-900">
                카테고리
              </h3>
              <div className="flex flex-col gap-1" role="radiogroup" aria-label="카테고리 필터">
                {CATEGORIES.map((category) => {
                  const isSelected = selectedCategory === category;
                  return (
                    <motion.label
                      key={category}
                      whileHover={{ x: 2 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                        isSelected
                          ? "bg-primary-50 font-medium text-primary-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div
                        className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 transition-all duration-200 ${
                          isSelected
                            ? "border-primary-700 bg-primary-700"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="h-1.5 w-1.5 rounded-full bg-white"
                          />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="category"
                        checked={isSelected}
                        onChange={() => selectCategory(category)}
                        className="sr-only"
                      />
                      {category}
                    </motion.label>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Search & Sort row */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="relative flex-1">
              <Search
                size={18}
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                  isSearchFocused ? "text-primary-700" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="상품명을 검색하세요"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                aria-label="상품 검색"
                className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-11 pr-4 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 transition-all duration-300 focus:border-primary-300 focus:outline-none focus:ring-4 focus:ring-primary-100"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-12 appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-primary-300 focus:outline-none focus:ring-4 focus:ring-primary-100"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 0.75rem center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "1.25em 1.25em",
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Result count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-sm font-medium text-gray-500"
          >
            총 <span className="font-bold text-gray-900">{total}</span>건의 상품
          </motion.p>

          {/* Loading state */}
          {isLoading && (
            <motion.div
              variants={shimmerVariants}
              initial="hidden"
              animate="visible"
              className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={shimmerItemVariants}
                  className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"
                >
                  <div className="relative h-[200px] overflow-hidden bg-gray-100">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                  </div>
                  <div className="flex flex-col gap-3 p-5">
                    <div className="relative h-5 w-20 overflow-hidden rounded-full bg-gray-100">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                    </div>
                    <div className="relative h-5 w-full overflow-hidden rounded-lg bg-gray-100">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                    </div>
                    <div className="relative h-5 w-28 overflow-hidden rounded-lg bg-gray-100">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                    </div>
                    <div className="relative mt-1 h-11 w-full overflow-hidden rounded-xl bg-gray-100">
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Error state */}
          {isError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-20 flex flex-col items-center justify-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
                <PackageSearch size={36} className="text-red-300" />
              </div>
              <p className="mt-5 text-lg font-semibold text-gray-900">
                상품을 불러오지 못했습니다
              </p>
              <p className="mt-1.5 text-sm text-gray-500">
                잠시 후 다시 시도해주세요
              </p>
            </motion.div>
          )}

          {/* Product grid */}
          {!isLoading && !isError && (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedCategory}-${sortBy}-${searchQuery}-${page}`}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                >
                  {products.map((product) => (
                    <motion.div key={product.id} variants={itemVariants}>
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {products.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-20 flex flex-col items-center justify-center"
                >
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gray-50 to-gray-100">
                    <PackageSearch size={40} className="text-gray-300" />
                  </div>
                  <p className="mt-5 text-lg font-semibold text-gray-900">
                    검색 결과가 없습니다
                  </p>
                  <p className="mt-1.5 text-sm text-gray-500">
                    다른 검색어나 필터를 시도해보세요
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-5 flex items-center gap-1.5 rounded-xl bg-primary-50 px-5 py-2.5 text-sm font-semibold text-primary-700 transition-all hover:bg-primary-100"
                  >
                    <RotateCcw size={14} />
                    필터 초기화
                  </button>
                </motion.div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-10 flex items-center justify-center gap-1.5"
                >
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm text-gray-500 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow disabled:opacity-40 disabled:hover:bg-white disabled:hover:shadow-sm"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (p === 1 || p === totalPages) return true;
                      if (Math.abs(p - page) <= 2) return true;
                      return false;
                    })
                    .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                      if (idx > 0) {
                        const prev = arr[idx - 1];
                        if (p - prev > 1) {
                          acc.push("ellipsis");
                        }
                      }
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "ellipsis" ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="flex h-10 w-10 items-center justify-center text-sm text-gray-400"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setPage(item)}
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 ${
                            page === item
                              ? "bg-primary-700 text-white shadow-sm"
                              : "border border-gray-200 bg-white text-gray-600 shadow-sm hover:border-gray-300 hover:bg-gray-50 hover:shadow"
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-sm text-gray-500 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50 hover:shadow disabled:opacity-40 disabled:hover:bg-white disabled:hover:shadow-sm"
                  >
                    &gt;
                  </button>
                </motion.div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
