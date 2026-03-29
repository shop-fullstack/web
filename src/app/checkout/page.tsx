"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck } from "lucide-react";
import { Header } from "@/components/header";
import { useCartStore } from "@/store/cart-store";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const totalAmount = useCartStore((s) => s.totalAmount);
  const clear = useCartStore((s) => s.clear);

  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [agreed, setAgreed] = useState(false);

  const handleCheckout = () => {
    if (!agreed) return;
    clear();
    router.push("/orders");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-layout px-12 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">결제하기</h1>

        <div className="flex gap-8">
          {/* Left column - delivery & payment info */}
          <div className="flex-1 space-y-6">
            {/* Delivery info */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                배송 정보
              </h2>

              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">
                    배송지 주소
                  </span>
                  <p className="mt-1 text-sm text-gray-900">
                    서울특별시 마포구 합정동 123-45
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-500">
                    희망 배송일
                  </span>
                  <p className="mt-1 text-sm text-gray-900">
                    2025년 4월 3일 (목)
                  </p>
                </div>

                <div className="flex items-start gap-2 rounded-lg bg-info-light p-3">
                  <Truck size={16} className="mt-0.5 flex-shrink-0 text-primary-700" />
                  <p className="text-xs text-gray-500">
                    냉장 배송이 필요 없는 것은 일반 배송으로 보냅니다
                  </p>
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                결제 수단
              </h2>

              <div className="space-y-3">
                {[
                  { value: "card", label: "신용/체크카드" },
                  { value: "easy", label: "간편결제" },
                  { value: "bank", label: "무통장입금" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 accent-primary-700"
                    />
                    <span className="text-sm text-gray-900">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>

              <div className="mt-4 rounded-lg bg-warning-light p-3">
                <p className="text-xs text-gray-500">
                  실제 결제는 발생하지 않습니다 (데모 주문 처리됩니다)
                </p>
              </div>
            </div>

            {/* Agreement checkbox */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-4 w-4 rounded accent-primary-700"
              />
              <span className="text-sm text-gray-900">
                주문 내용을 확인하였으며 결제에 동의합니다
              </span>
            </label>
          </div>

          {/* Right column - order summary */}
          <div className="w-[400px] flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                주문 요약
              </h2>

              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-500 truncate mr-3">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span className="text-gray-900 whitespace-nowrap">
                      {(item.product.price * item.quantity).toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">
                    총 결제금액
                  </span>
                  <span className="text-xl font-bold text-primary-700">
                    {totalAmount().toLocaleString()}원
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={!agreed}
                className="w-full h-12 rounded-lg bg-primary-700 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {totalAmount().toLocaleString()}원 결제하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
