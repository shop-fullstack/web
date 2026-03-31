"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navItems = [
    { href: "/", label: "홈" },
    { href: "/products", label: "상품" },
    { href: "/trend", label: "트렌드" },
    { href: "/recommend", label: "AI 추천", icon: true },
    { href: "/forecast", label: "수요예측" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 h-16 bg-white/95 transition-all duration-300 ${
        scrolled ? "shadow-md border-b border-gray-100" : "border-b border-gray-200"
      }`}
    >
      <div className="mx-auto flex h-full max-w-layout items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-700 to-primary-500 text-xs font-bold text-white">
              B
            </div>
            <span className="text-xl font-bold tracking-tight text-primary-700">
              비즈마트
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative rounded-lg px-4 py-2 text-[14px] font-medium transition-all duration-200 ${
                pathname === item.href
                  ? "text-primary-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="flex items-center gap-1">
                {"icon" in item && item.icon && <Sparkles size={12} />}
                {item.label}
              </span>
              {pathname === item.href && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-primary-500"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                href="/cart"
                aria-label={`장바구니${cartCount > 0 ? ` (${cartCount}개)` : ""}`}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-all duration-200 hover:bg-gray-50 hover:text-primary-700"
              >
                <ShoppingCart size={20} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-700 px-1 text-[10px] font-bold text-white shadow-sm"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
              <Link
                href="/mypage"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white shadow-sm transition-transform duration-200 hover:scale-105"
              >
                {user?.owner_name?.charAt(0) || "U"}
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-primary-700 hover:bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200"
            >
              로그인
            </Link>
          )}
          <button
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 hover:bg-gray-50 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-gray-100 bg-white md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium ${
                    pathname === item.href
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
