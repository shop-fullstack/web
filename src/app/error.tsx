"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6" role="alert">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-error-light">
          <AlertTriangle size={36} className="text-error" />
        </div>
        <h2 className="mt-6 text-xl font-bold text-gray-900">
          문제가 발생했습니다
        </h2>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          일시적인 오류가 발생했습니다. 다시 시도하거나 홈으로 이동해주세요.
        </p>
        <div className="mt-8 flex gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow"
          >
            <RotateCcw size={16} />
            다시 시도
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-primary-700 hover:bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all"
          >
            <Home size={16} />
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
