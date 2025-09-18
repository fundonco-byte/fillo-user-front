import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NextAuthSessionProvider from "./session-provider";
import { GlobalErrorProvider } from "@/context/GlobalErrorContext";
import GlobalErrorInitializer from "@/components/GlobalErrorInitializer";

export const metadata: Metadata = {
  title: "Fillo - 함께하는 스포츠 팬덤 커뮤니티",
  description:
    "함께하는 스포츠 팬덤 커뮤니티. 혼자 보는 경기가 아쉽다면, Fillo에서 함께할 스포츠 팬 친구들을 찾아보세요!",
  keywords:
    "스포츠, 팬덤, 매칭, 커뮤니티, 모임, 소셜, 네트워킹, 축구, 야구, 농구",
  openGraph: {
    title: "Fillo - 스포츠 팬덤 매칭 플랫폼",
    description: "AI 매칭으로 찾는 나만의 스포츠 팬덤 커뮤니티",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fillo - 스포츠 팬덤 매칭 플랫폼",
    description: "AI 매칭으로 찾는 나만의 스포츠 팬덤 커뮤니티",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/assets/images/fillo-logo-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Pretendard:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <NextAuthSessionProvider>
          <GlobalErrorProvider>
            <GlobalErrorInitializer />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </GlobalErrorProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
