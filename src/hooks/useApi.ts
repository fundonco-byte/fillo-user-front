"use client";

import { useState, useCallback } from "react";
import { apiRequest } from "@/lib/api";
import { ApiResponse } from "@/types/auth";

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export const useApi = <T = any>(options: UseApiOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(
    async (endpoint: string, requestOptions: RequestInit = {}) => {
      setLoading(true);
      setError(null);

      try {
        console.log(`[API 요청] ${endpoint}`, {
          method: requestOptions.method || "GET",
          headers: requestOptions.headers,
          body: requestOptions.body,
        });

        const response: ApiResponse<T> = await apiRequest<T>(
          endpoint,
          requestOptions
        );

        console.log(`[API 응답] ${endpoint}`, {
          statusCode: response.statusCode,
          statusMessage: response.statusMessage,
          data: response.data,
        });

        if (response.statusCode === "FO-200") {
          setData(response.data);
          options.onSuccess?.(response.data);
          return response;
        } else {
          if (response.statusCode === "FO-409") {
            console.log("[토큰 만료] 토큰이 만료되었습니다.");
            options.onSuccess?.("Token-Expired");
            return "Token-Expired";
          }

          const errorMessage = `API Error: ${response.statusCode} - ${
            response.statusMessage || "알 수 없는 오류"
          }`;
          console.error("[API 에러]", errorMessage, response);
          throw new Error(errorMessage);
        }
      } catch (err) {
        console.error(`[API 호출 실패] ${endpoint}`, err);
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        options.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [options]
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
