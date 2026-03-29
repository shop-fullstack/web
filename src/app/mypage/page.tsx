"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { User, Package, Calendar, LogOut, Mail, Loader2, Shield, ChevronRight } from "lucide-react";
import { Header } from "@/components/header";
import { useAuthStore } from "@/store/auth-store";
import { useMe, useLogout } from "@/lib/queries";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const navItems = [
  { href: "/mypage", icon: User, label: "내 정보" },
  { href: "/orders", icon: Package, label: "주문 내역" },
  { href: "/mypage/subscription", icon: Calendar, label: "정기구독 관리" },
];

export default function MyPage() {
  const router = useRouter();
  const pathname = usePathname();
  const authStore = useAuthStore();
  const { data: meData, isLoading } = useMe();
  const logoutMutation = useLogout();

  const user = meData?.data;

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    authStore.logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <Header />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header />

      <main className="mx-auto flex max-w-layout gap-8 px-12 py-10">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[260px] shrink-0"
        >
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-white border border-gray-100 shadow-sm p-7">
            {/* Avatar with gradient ring */}
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-primary-400 via-violet-400 to-indigo-500 opacity-80 blur-[2px]" />
              <div className="relative flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gradient-to-br from-primary-600 to-indigo-600 ring-3 ring-white">
                <span className="text-xl font-bold text-white">
                  {user?.owner_name?.charAt(0) ?? ""}
                </span>
              </div>
            </div>

            {/* Name & type */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-lg font-bold text-gray-900">
                {user?.owner_name}
              </span>
              <span className="text-sm text-gray-400">
                {user?.business_type}
              </span>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Nav menu */}
            <nav className="flex w-full flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "text-primary-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-xl bg-primary-50 border border-primary-100/60"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}
                    <Icon size={18} className="relative z-10" />
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <ChevronRight size={14} className="relative z-10 ml-auto text-primary-400" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {/* Logout */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:shadow-red-200/50 transition-shadow"
            >
              <LogOut size={16} />
              로그아웃
            </motion.button>
          </div>
        </motion.aside>

        {/* Main content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-1 flex-col gap-6"
        >
          {/* 계정 정보 */}
          <motion.section variants={itemVariants}>
            <h2 className="mb-3 text-lg font-bold text-gray-900">계정 정보</h2>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-800">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-50">
                    <Mail size={16} className="text-gray-500" />
                  </div>
                  <span className="font-medium">{user?.email}</span>
                </div>
                <button className="text-sm font-medium text-primary-500 hover:text-primary-700 transition-colors">
                  사업자 변경
                </button>
              </div>
            </div>
          </motion.section>

          {/* 사업자 정보 */}
          <motion.section variants={itemVariants}>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">사업자 정보</h2>
              <button className="text-sm font-medium text-primary-500 hover:text-primary-700 transition-colors">
                수정
              </button>
            </div>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <div className="flex flex-col gap-5">
                {[
                  { label: "사업자등록번호", value: user?.business_number },
                  { label: "업종", value: user?.business_type },
                  { label: "상호명", value: user?.company_name },
                  { label: "대표자명", value: user?.owner_name },
                ].map((row) => (
                  <div key={row.label} className="flex items-center">
                    <span className="w-32 text-sm text-gray-400 font-medium">
                      {row.label}
                    </span>
                    <span className="text-sm font-medium text-gray-800">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* 회원 등급 */}
          <motion.section variants={itemVariants}>
            <h2 className="mb-3 text-lg font-bold text-gray-900">회원 등급</h2>
            <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm">
                  <Shield size={18} className="text-white" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="inline-flex w-fit items-center rounded-full bg-gradient-to-r from-primary-500 to-indigo-500 px-4 py-1.5 text-sm font-bold text-white shadow-sm">
                    {user?.grade ?? "일반회원"}
                  </span>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    누적 구매금액 30만원 이상 시 프리미엄 회원으로 등급 전환됩니다
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </main>
    </div>
  );
}
