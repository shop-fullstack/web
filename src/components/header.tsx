"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuthStore();
  const totalCount = useCartStore((s) => s.totalCount);

  const navItems = [
    { href: "/", label: "홈" },
    { href: "/products", label: "상품" },
    { href: "/trend", label: "트렌드" },
  ];

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-full max-w-layout items-center justify-between px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-[22px] font-bold text-primary-700">
            비즈마트
          </Link>
        </div>

        <nav className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[15px] ${
                pathname === item.href
                  ? "font-semibold text-primary-700"
                  : "text-gray-500 hover:text-primary-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/cart"
                className="relative flex items-center gap-1 text-gray-500 hover:text-primary-700"
              >
                <ShoppingCart size={20} />
                {totalCount() > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary-500 px-1 text-[11px] font-bold text-white">
                    {totalCount()}
                  </span>
                )}
              </Link>
              <Link
                href="/mypage"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-700 text-sm font-bold text-white"
              >
                {user?.owner_name?.charAt(0) || "U"}
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-900"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
