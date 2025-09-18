"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { signOut } from "next-auth/react";
import { clearAuthTokens } from "@/lib/api";

interface GlobalErrorContextType {
  showTokenExpiredDialog: boolean;
  handleTokenExpired: () => void;
  handleDialogConfirm: () => void;
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
  const [showTokenExpiredDialog, setShowTokenExpiredDialog] = useState(false);

  const handleTokenExpired = () => {
    setShowTokenExpiredDialog(true);
  };

  const handleDialogConfirm = async () => {
    setShowTokenExpiredDialog(false);

    try {
      // 토큰 제거
      clearAuthTokens();

      // NextAuth 세션 제거
      await signOut({ redirect: false });

      // 사전 등록 페이지로 이동
      window.location.href = "/pre-register";
    } catch (error) {
      console.error("로그아웃 처리 중 오류:", error);
      // 오류가 발생해도 사전 등록 페이지로 이동
      window.location.href = "/pre-register";
    }
  };

  return (
    <GlobalErrorContext.Provider
      value={{
        showTokenExpiredDialog,
        handleTokenExpired,
        handleDialogConfirm,
      }}
    >
      {children}

      {/* 토큰 만료 다이얼로그 */}
      {showTokenExpiredDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              세션 만료 알림
            </h3>
            <p className="text-gray-600 mb-6">
              계정 유지 시간이 지났습니다. 다시 로그인해주세요.
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleDialogConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </GlobalErrorContext.Provider>
  );
};
