"use client";

import { useEffect } from "react";
import { useGlobalError } from "@/context/GlobalErrorContext";
import { setGlobalErrorHandler } from "@/lib/api";

const GlobalErrorInitializer = () => {
  const { handleTokenExpired } = useGlobalError();

  useEffect(() => {
    // 전역 에러 핸들러 설정
    setGlobalErrorHandler((statusCode: string) => {
      if (statusCode === "FO-999") {
        handleTokenExpired();
      }
    });
  }, [handleTokenExpired]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
};

export default GlobalErrorInitializer;
