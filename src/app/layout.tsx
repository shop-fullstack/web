import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { AuthHydrator } from "@/components/auth-hydrator";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
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
    <html lang="ko" className={inter.variable}>
      <body className="font-sans antialiased">
        <QueryProvider>
          <AuthHydrator>{children}</AuthHydrator>
        </QueryProvider>
      </body>
    </html>
  );
}
