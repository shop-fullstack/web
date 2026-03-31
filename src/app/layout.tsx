import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { AuthHydrator } from "@/components/auth-hydrator";
import { ChatWidget } from "@/components/chatbot/chat-widget";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  variable: "--font-kr",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "비즈마트 | 소상공인을 위한 B2B 쇼핑몰",
  description: "업종별 트렌드 분석으로 잘 팔리는 상품을 먼저 만나세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${jakarta.variable} ${notoSansKR.variable}`}>
      <body className="font-sans antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-primary-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg">
          본문으로 건너뛰기
        </a>
        <QueryProvider>
          <AuthHydrator>
            {children}
            <ChatWidget />
          </AuthHydrator>
        </QueryProvider>
      </body>
    </html>
  );
}
