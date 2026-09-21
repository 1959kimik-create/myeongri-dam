import type { Metadata } from "next";
import { Geist } from "next/font/google";
import BackgroundVideo from "@/components/BackgroundVideo";
import Header from "@/components/Header";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "명리담 — AI 사주 상담",
  description: "정확한 사주 데이터와 명리학을 기반으로 AI가 나의 고민을 상담합니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${geist.variable} h-full`}>
      <body className="min-h-full antialiased">
        <BackgroundVideo />
        <Header />
        <main className="relative">{children}</main>
      </body>
    </html>
  );
}
