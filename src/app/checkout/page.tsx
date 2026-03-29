"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, CreditCard, Wallet, Building2, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import { useCartStore } from "@/store/cart-store";
import { useCreateOrder } from "@/lib/queries";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" as const },
  }),
};

const PAYMENT_METHODS = [
  { value: "card", label: "신용/체크카드", icon: CreditCard },
  { value: "easy", label: "간편결제", icon: Wallet },
  { value: "bank", label: "무통장입금", icon: Building2 },
] as const;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const totalAmount = useCartStore((s) => s.totalAmount);
  const clear = useCartStore((s) => s.clear);

  const orderMutation = useCreateOrder();

  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!agreed) return;
    setError(null);
    try {
      await orderMutation.mutateAsync({
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        delivery_address: "서울특별시 마포구 합정동 123-45",
        delivery_date: "2026-04-05",
        is_cold: false,
      });
      clear();
      router.push("/orders");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "주문 처리 중 오류가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-layout px-12 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl font-bold text-gray-900 mb-8"
        >
          결제하기
        </motion.h1>

        <div className="flex gap-8">
          {/* Left column - delivery & payment info */}
          <div className="flex-1 space-y-6">
            {/* Delivery info */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-5">
                배송 정보
              </h2>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    배송지 주소
                  </span>
                  <p className="mt-1.5 text-sm font-medium text-gray-900">
                    서울특별시 마포구 합정동 123-45
                  </p>
                </div>

                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    희망 배송일
                  </span>
                  <p className="mt-1.5 text-sm font-medium text-gray-900">
                    2026년 4월 5일 (일)
                  </p>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-primary-50/60 border border-primary-100 p-3.5">
                  <Truck size={16} className="mt-0.5 flex-shrink-0 text-primary-600" />
                  <p className="text-xs text-gray-500 leading-relaxed">
                    냉장 배송이 필요 없는 것은 일반 배송으로 보냅니다
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Payment method */}
            <motion.div
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-5">
                결제 수단
              </h2>

              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = paymentMethod === method.value;
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3.5 cursor-pointer rounded-xl border-2 px-4 py-3.5 transition-all duration-200 ${
                        isSelected
                          ? "border-primary-700 bg-primary-50/50"
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors duration-200 ${
                          isSelected
                            ? "border-primary-700 bg-primary-700"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>
                      <Icon
                        size={18}
                        className={
                          isSelected ? "text-primary-700" : "text-gray-400"
                        }
                      />
                      <input
                        type="radio"
                        name="payment"
                        value={method.value}
                        checked={isSelected}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="sr-only"
                      />
                      <span
                        className={`text-sm font-medium ${
                          isSelected ? "text-primary-700" : "text-gray-700"
                        }`}
                      >
                        {method.label}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-3.5">
                <p className="text-xs text-amber-600">
                  실제 결제는 발생하지 않습니다 (데모 주문 처리됩니다)
                </p>
              </div>
            </motion.div>

            {/* Agreement checkbox */}
            <motion.label
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 cursor-pointer group"
            >
              <button
                type="button"
                role="checkbox"
                aria-checked={agreed}
                onClick={() => setAgreed(!agreed)}
                className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all duration-200 ${
                  agreed
                    ? "border-primary-700 bg-primary-700"
                    : "border-gray-300 group-hover:border-gray-400"
                }`}
              >
                {agreed && <Check size={13} className="text-white" strokeWidth={3} />}
              </button>
              <span className="text-sm text-gray-700 select-none">
                주문 내용을 확인하였으며 결제에 동의합니다
              </span>
            </motion.label>
          </div>

          {/* Right column - order summary */}
          <div className="w-[400px] flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden sticky top-24"
            >
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  주문 요약
                </h2>

                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-400 truncate mr-3">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span className="text-gray-900 font-medium whitespace-nowrap">
                        {(item.product.price_per_box * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient total section */}
              <div className="bg-gradient-to-r from-primary-50 to-blue-50 px-6 py-5">
                <div className="flex justify-between items-center mb-5">
                  <span className="text-base font-bold text-gray-900">
                    총 결제금액
                  </span>
                  <span className="text-xl font-bold text-primary-700">
                    {totalAmount().toLocaleString()}원
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={!agreed || orderMutation.isPending}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary-700 to-primary-500 text-white font-semibold shadow-lg shadow-primary-700/20 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary-700/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg flex items-center justify-center gap-2"
                >
                  {orderMutation.isPending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>주문 처리 중...</span>
                    </>
                  ) : (
                    `${totalAmount().toLocaleString()}원 결제하기`
                  )}
                </button>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm text-red-600 text-center bg-red-50 rounded-lg py-2 px-3"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
