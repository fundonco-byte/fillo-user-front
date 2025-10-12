"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { signOut } from "next-auth/react";
import { clearAuthTokens } from "@/lib/api";

interface GlobalErrorContextType {
  handleTokenExpired: () => void;
}

const GlobalErrorContext = createContext<GlobalErrorContextType | undefined>(
  undefined
);

export const useGlobalError = () => {
  const context = useContext(GlobalErrorContext);
  if (!context) {
    throw new Error("useGlobalError must be used within a GlobalErrorProvider");
  }
  return context;
};

interface GlobalErrorProviderProps {
  children: ReactNode;
}

export const GlobalErrorProvider: React.FC<GlobalErrorProviderProps> = ({
  children,
}) => {
  const handleTokenExpired = async () => {
    // console.log(
    //   "[토큰 만료] FO-999 상태 코드 감지 - 토큰 초기화 및 리다이렉트 시작"
    // );

    try {
      // 1. localStorage 토큰 제거
      clearAuthTokens();
      // console.log("[토큰 만료] localStorage 토큰 제거 완료");

      // 2. NextAuth 세션 제거
      await signOut({ redirect: false });
      // console.log("[토큰 만료] NextAuth 세션 제거 완료");

      // 3. sessionStorage 초기화 (혹시 있을 수 있는 다른 데이터)
      if (typeof window !== "undefined") {
        sessionStorage.clear();
        // console.log("[토큰 만료] sessionStorage 초기화 완료");
      }

      // 4. pre-register 페이지로 리다이렉트
      // console.log("[토큰 만료] pre-register 페이지로 리다이렉트");
      window.location.href = "/pre-register";
    } catch (error) {
      // console.error("[토큰 만료] 처리 중 오류 발생:", error);
      // 오류가 발생해도 사전 등록 페이지로 이동
      window.location.href = "/pre-register";
    }
  };

  return (
    <GlobalErrorContext.Provider
      value={{
        handleTokenExpired,
      }}
    >
      {children}
    </GlobalErrorContext.Provider>
  );
};
