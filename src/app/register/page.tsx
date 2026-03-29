"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { useRegister } from "@/lib/queries";

const businessTypes = [
  "카페/베이커리",
  "식당/외식업",
  "미용실/뷰티",
  "편의점/소매업",
  "네일샵/피부샵",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const inputClassName =
  "w-full h-12 px-4 border border-gray-200/80 rounded-xl bg-white/80 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400";

export default function RegisterPage() {
  const router = useRouter();
  const authStore = useAuthStore();
  const registerMutation = useRegister();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !passwordConfirm) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!businessNumber || !businessType || !companyName || !ownerName) {
      setError("사업자 정보를 모두 입력해주세요.");
      return;
    }

    try {
      const data = await registerMutation.mutateAsync({
        email,
        password,
        business_number: businessNumber,
        business_type: businessType,
        company_name: companyName,
        owner_name: ownerName,
      });
      authStore.login(data.data.access_token, data.data.user);
      router.push("/");
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary-200/30 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary-300/20 blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 h-[300px] w-[300px] rounded-full bg-violet-200/20 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 w-full max-w-[560px] rounded-3xl border border-white/60 bg-white/70 p-10 shadow-2xl shadow-gray-200/50 backdrop-blur-xl"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Title */}
          <motion.div variants={itemVariants} className="text-center mb-2">
            <div className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-700 to-primary-500 shadow-lg shadow-primary-700/25">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-primary-700">회원가입</h1>
            </div>
          </motion.div>
          <motion.p
            variants={itemVariants}
            className="text-center text-gray-500 text-sm mb-8"
          >
            사업자 정보를 입력해주세요
          </motion.p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Section 1: Account info */}
            {/* Email */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력해주세요"
                className={inputClassName}
              />
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력해주세요"
                  className="w-full h-12 px-4 pr-11 border border-gray-200/80 rounded-xl bg-white/80 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </motion.div>

            {/* Password Confirm */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="passwordConfirm"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                비밀번호 확인
              </label>
              <div className="relative">
                <input
                  id="passwordConfirm"
                  type={showPasswordConfirm ? "text" : "password"}
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="비밀번호를 다시 입력해주세요"
                  className="w-full h-12 px-4 pr-11 border border-gray-200/80 rounded-xl bg-white/80 text-sm text-gray-900 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  <EyeIcon open={showPasswordConfirm} />
                </button>
              </div>
            </motion.div>

            {/* Divider with label */}
            <motion.div variants={itemVariants} className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200/80" />
              </div>
              <div className="relative flex justify-center">
                <span className="relative z-10 bg-white/70 backdrop-blur-sm px-4 text-sm font-semibold text-primary-700">
                  사업자 정보
                </span>
              </div>
            </motion.div>

            {/* Section 2: Business info */}
            {/* Business Number */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="businessNumber"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                사업자등록번호
              </label>
              <input
                id="businessNumber"
                type="text"
                value={businessNumber}
                onChange={(e) => setBusinessNumber(e.target.value)}
                placeholder="000-00-00000"
                className={inputClassName}
              />
            </motion.div>

            {/* Business Type */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="businessType"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                업종 선택
              </label>
              <select
                id="businessType"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full h-12 px-4 border border-gray-200/80 rounded-xl bg-white/80 text-sm text-gray-900 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_14px_center] bg-no-repeat"
              >
                <option value="" disabled>
                  업종을 선택해주세요
                </option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Company Name */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="companyName"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                상호명
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="상호명을 입력해주세요"
                className={inputClassName}
              />
            </motion.div>

            {/* Owner Name */}
            <motion.div variants={itemVariants}>
              <label
                htmlFor="ownerName"
                className="block text-sm font-medium text-gray-900 mb-1.5"
              >
                대표자명
              </label>
              <input
                id="ownerName"
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="대표자명을 입력해주세요"
                className={inputClassName}
              />
            </motion.div>

            {/* Error message */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-error"
              >
                {error}
              </motion.p>
            )}

            {/* Register button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={registerMutation.isPending}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full h-12 bg-gradient-to-r from-primary-700 to-primary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-700/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-700/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
              >
                {registerMutation.isPending ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    가입 처리 중...
                  </span>
                ) : (
                  "회원가입"
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Login link */}
          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-gray-500 mt-6"
          >
            이미 계정이 있으신가요?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary-700 hover:text-primary-600 transition-colors hover:underline"
            >
              로그인
            </Link>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
