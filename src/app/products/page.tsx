"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Header } from "@/components/header";
import { ProductCard } from "@/components/product-card";
import { dummyProducts } from "@/lib/dummy-data";

const CATEGORIES = ["소모품", "식자재", "포장재", "뷰티용품", "인테리어", "기타"];
const SORT_OPTIONS = [
  { value: "popular", label: "인기순" },
  { value: "price-asc", label: "가격 낮은순" },
  { value: "price-desc", label: "가격 높은순" },
  { value: "newest", label: "최신순" },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("popular");

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
  };

  const filteredProducts = useMemo(() => {
    let result = [...dummyProducts];

    // Search filter
    if (searchQuery.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Price filter
    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      default:
        // "popular" - keep original order
        break;
    }

    return result;
  }, [searchQuery, selectedCategories, minPrice, maxPrice, sortBy]);

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
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="h-4 w-4 rounded border-gray-200 text-primary-700 accent-primary-700"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          {/* Price range filter */}
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">가격대</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="최소"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="h-9 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-700"
              />
              <span className="text-gray-500">~</span>
              <input
                type="number"
                placeholder="최대"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="h-9 w-full rounded-lg border border-gray-200 px-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-700 focus:outline-none focus:ring-1 focus:ring-primary-700"
              />
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            총 {filteredProducts.length}건의 상품
          </p>

          {/* Product grid */}
          <div className="mt-4 grid grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="mt-16 flex flex-col items-center justify-center text-gray-500">
              <p className="text-lg font-medium">검색 결과가 없습니다</p>
              <p className="mt-1 text-sm">다른 검색어나 필터를 시도해보세요</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
