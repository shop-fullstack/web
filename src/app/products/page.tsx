"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
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

export default function ProductsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto flex max-w-layout gap-6 px-8 py-6">
        {/* Sidebar */}
        <aside className="w-[240px] shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">필터</h2>
            <button
              type="button"
              onClick={resetFilters}
              className="text-sm text-gray-500 hover:text-primary-700"
            >
              초기화
            </button>
          </div>

          {/* Category filter */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">카테고리</h3>
            <div className="flex flex-col gap-2.5">
              {CATEGORIES.map((category) => (
                <label
                  key={category}
                  className="flex cursor-pointer items-center gap-2 text-sm text-gray-900"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === category}
                    onChange={() => selectCategory(category)}
                    className="h-4 w-4 border-gray-200 text-primary-700 accent-primary-700"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          {/* Search & Sort row */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="상품명을 검색하세요"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-200 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-700"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-11 rounded-lg border border-gray-200 bg-white px-3 pr-8 text-sm text-gray-900 focus:border-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-700"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Result count */}
          <p className="mt-4 text-sm text-gray-500">
            총 {total}건의 상품
          </p>

          {/* Loading state */}
          {isLoading && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
                >
                  <div className="h-[200px] animate-pulse bg-gray-200" />
                  <div className="flex flex-col gap-2 p-4">
                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="mt-16 flex flex-col items-center justify-center text-gray-500">
              <p className="text-lg font-medium">상품을 불러오지 못했습니다</p>
              <p className="mt-1 text-sm">잠시 후 다시 시도해주세요</p>
            </div>
          )}

          {/* Product grid */}
          {!isLoading && !isError && (
            <>
              <div className="mt-4 grid grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {products.length === 0 && (
                <div className="mt-16 flex flex-col items-center justify-center text-gray-500">
                  <p className="text-lg font-medium">검색 결과가 없습니다</p>
                  <p className="mt-1 text-sm">다른 검색어나 필터를 시도해보세요</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-40"
                  >
                    &lt;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      // Show first, last, and pages near current
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
                          className="flex h-9 w-9 items-center justify-center text-sm text-gray-400"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setPage(item)}
                          className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm ${
                            page === item
                              ? "border-primary-700 bg-primary-700 text-white"
                              : "border-gray-200 text-gray-500 hover:bg-gray-100"
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-40"
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
