"use client";

import { useState, useCallback, useRef } from "react";
import { apiRequest } from "@/lib/api";
import { ApiResponse } from "@/types/auth";

interface UseApiOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
}

export const useApi = <T = unknown>(options: UseApiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (endpoint: string, requestOptions: RequestInit = {}) => {
      // 이미 로딩 중이면 중복 호출 방지
      if (loading) {
        // console.log(`[API 중복 호출 방지] ${endpoint} - 이미 요청 진행 중`);
        return;
      }

      // 이전 요청이 있다면 취소
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // 새로운 AbortController 생성
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setLoading(true);
      setError(null);

      try {
        // console.log(`[API 요청] ${endpoint}`, {
        //   method: requestOptions.method || "GET",
        //   headers: requestOptions.headers,
        //   body: requestOptions.body,
        // });

        const response: ApiResponse<T> = await apiRequest<T>(endpoint, {
          ...requestOptions,
          signal: abortController.signal,
        });

        // console.log(`[API 응답] ${endpoint}`, {
        //   statusCode: response.statusCode,
        //   statusMessage: response.statusMessage,
        //   data: response.data,
        // });

        if (response.statusCode === "FO-200") {
          setData(response.data);
          options.onSuccess?.(response.data);
          return response;
        } else {
          if (response.statusCode === "FO-409") {
            // console.log("[토큰 만료] 토큰이 만료되었습니다.");
            options.onSuccess?.("Token-Expired");
            return "Token-Expired";
          }

          // FO-999는 apiRequest에서 이미 처리됨
          // globalErrorHandler가 호출되어 자동으로 리다이렉트됨
          if (response.statusCode === "FO-999") {
            // console.log("[토큰 만료] FO-999 감지 - 리다이렉트 처리 중");
            throw new Error("Token expired");
          }

          const errorMessage = `API Error: ${response.statusCode} - ${
            response.statusMessage || "알 수 없는 오류"
          }`;
          // console.error("[API 에러]", errorMessage, response);
          throw new Error(errorMessage);
        }
      } catch (err) {
        // AbortError는 무시
        if (err instanceof Error && err.name === "AbortError") {
          // console.log(`[API 요청 취소됨] ${endpoint}`);
          return;
        }

        // console.error(`[API 호출 실패] ${endpoint}`, err);
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [loading, options]
  );

  return {
    loading,
    error,
    data,
    execute,
  };
};

// 사용 예시:
// const { loading, error, data, execute } = useApi({
//   onSuccess: (data) => console.log('Success:', data),
//   onError: (error) => console.error('Error:', error),
// });
//
// // GET 요청
// await execute('/api/v1/admin/products');
//
// // POST 요청
// await execute('/api/v1/admin/products', {
//   method: 'POST',
//   body: JSON.stringify({ name: 'New Product' }),
// });
