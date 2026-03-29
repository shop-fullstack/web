"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Package, Calendar, LogOut, Mail } from "lucide-react";
import { Header } from "@/components/header";
import { useAuthStore } from "@/store/auth-store";
import { dummyUser } from "@/lib/dummy-data";

export default function MyPage() {
  const router = useRouter();
  const authStore = useAuthStore();

  const handleLogout = () => {
    authStore.logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto flex max-w-layout gap-8 px-12 py-8">
        {/* Sidebar */}
        <aside className="w-[240px] shrink-0">
          <div className="flex flex-col items-center gap-5 rounded-lg border border-gray-200 bg-white p-6">
            {/* Avatar */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-700">
              <span className="text-xl font-bold text-white">
                {dummyUser.owner_name.charAt(0)}
              </span>
            </div>

            {/* Name */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg font-bold text-gray-900">
                {dummyUser.owner_name}
              </span>
              <span className="text-sm text-gray-500">
                {dummyUser.business_type}
              </span>
            </div>

            {/* Nav menu */}
            <nav className="flex w-full flex-col gap-1">
              <Link
                href="/mypage"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-primary-700"
              >
                <User size={18} />
                내 정보
              </Link>
              <Link
                href="/orders"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-500 hover:text-gray-900"
              >
                <Package size={18} />
                주문 내역
              </Link>
              <Link
                href="/mypage/subscription"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-500 hover:text-gray-900"
              >
                <Calendar size={18} />
                정기구독 관리
              </Link>
            </nav>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-error hover:opacity-80"
            >
              <LogOut size={18} />
              로그아웃
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col gap-6">
          {/* 계정 정보 */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">계정 정보</h2>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-900">
                  <Mail size={16} className="text-gray-500" />
                  {dummyUser.email}
                </div>
                <button className="text-sm text-primary-500 hover:underline">
                  사업자 변경
                </button>
              </div>
            </div>
          </section>

          {/* 사업자 정보 */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">사업자 정보</h2>
              <button className="text-sm text-primary-500 hover:underline">
                수정
              </button>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center">
                  <span className="w-32 text-sm text-gray-500">
                    사업자등록번호
                  </span>
                  <span className="text-sm text-gray-900">
                    {dummyUser.business_number}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-sm text-gray-500">업종</span>
                  <span className="text-sm text-gray-900">
                    {dummyUser.business_type}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-sm text-gray-500">상호명</span>
                  <span className="text-sm text-gray-900">
                    {dummyUser.company_name}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="w-32 text-sm text-gray-500">대표자명</span>
                  <span className="text-sm text-gray-900">
                    {dummyUser.owner_name}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 회원 등급 */}
          <section>
            <h2 className="mb-3 text-lg font-bold text-gray-900">회원 등급</h2>
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex flex-col gap-3">
                <span className="inline-flex w-fit rounded-full bg-info-light px-3 py-1 text-sm font-semibold text-primary-500">
                  일반회원
                </span>
                <p className="text-sm text-gray-500">
                  누적 구매금액 30만원 이상 시 프리미엄 회원으로 등급
                  전환됩니다
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
