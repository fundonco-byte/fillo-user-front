"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextInput } from "@/components/ui";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { isValidPassword } from "@/lib/utils";
import { useApi } from "@/hooks/useApi";
import { createHeaders } from "@/lib/api";

const PasswordChangePage = () => {
  const router = useRouter();
  const { data, execute, loading, error } = useApi();
  const [formData, setFormData] = useState({
    password: "",
    checkPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    checkPassword: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = "새 비밀번호를 입력해주세요.";
    } else if (!isValidPassword(formData.password)) {
      newErrors.password =
        "비밀번호는 8자 이상이며, 문자, 숫자, 특수문자를 포함해야 합니다.";
    }

    if (!formData.checkPassword) {
      newErrors.checkPassword = "비밀번호 확인을 입력해주세요.";
    } else if (formData.password !== formData.checkPassword) {
      newErrors.checkPassword = "비밀번호가 일치하지 않습니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const togglePasswordVisibility = (field: "password" | "checkPassword") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // 비밀번호 변경 API 호출 (실제 구현 시 필요)
      const response = await execute("/api/v1/member/update/password", {
        method: "PUT",
        headers: await createHeaders(true, true),
        body: JSON.stringify({
          password: formData.password,
          checkPassword: formData.checkPassword,
        }),
      });

      if (typeof response !== "string" && response.statusCode === "FO-200") {
        const res = response;
        if (res.statusCode === "FO-200") {
          alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.");
          router.push("/auth/login");
        }
      } else {
        alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("비밀번호 변경 실패:", error);
      alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, text: "", color: "" };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    score = Object.values(checks).filter(Boolean).length;

    if (score < 3) return { strength: 1, text: "약함", color: "text-red-500" };
    if (score < 4)
      return { strength: 2, text: "보통", color: "text-yellow-500" };
    return { strength: 3, text: "강함", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* 헤더 */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                비밀번호 재설정
              </h1>
              <p className="text-gray-600">새로운 비밀번호를 설정해주세요</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 새 비밀번호 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  새 비밀번호 <span className="text-accent-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.password ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="새 비밀번호를 입력해주세요"
                    className={`w-full px-4 py-3 pr-12 text-base text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 ${
                      errors.password
                        ? "border-accent-error focus:ring-accent-error"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("password")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.password ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* 비밀번호 강도 표시 */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">
                        비밀번호 강도
                      </span>
                      <span
                        className={`text-xs font-medium ${passwordStrength.color}`}
                      >
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.strength === 1
                            ? "bg-red-500"
                            : passwordStrength.strength === 2
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${(passwordStrength.strength / 3) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-sm text-accent-error mt-2">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  비밀번호 확인 <span className="text-accent-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.checkPassword ? "text" : "password"}
                    value={formData.checkPassword}
                    onChange={(e) =>
                      handleInputChange("checkPassword", e.target.value)
                    }
                    placeholder="비밀번호를 다시 입력해주세요"
                    className={`w-full px-4 py-3 pr-12 text-base text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 ${
                      errors.checkPassword
                        ? "border-accent-error focus:ring-accent-error"
                        : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("checkPassword")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.checkPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* 일치 확인 표시 */}
                {formData.checkPassword && formData.password && (
                  <div className="mt-2 flex items-center">
                    {formData.password === formData.checkPassword ? (
                      <div className="flex items-center text-green-500">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        <span className="text-xs">비밀번호가 일치합니다</span>
                      </div>
                    ) : (
                      <span className="text-xs text-accent-error">
                        비밀번호가 일치하지 않습니다
                      </span>
                    )}
                  </div>
                )}

                {errors.checkPassword && (
                  <p className="text-sm text-accent-error mt-2">
                    {errors.checkPassword}
                  </p>
                )}
              </div>

              {/* 비밀번호 조건 안내 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  비밀번호 조건
                </h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• 8자 이상</li>
                  <li>• 영문자, 숫자, 특수문자 포함</li>
                  <li>• 안전한 비밀번호를 사용하세요</li>
                </ul>
              </div>

              {/* 제출 버튼 */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                leftIcon={<Lock className="w-5 h-5" />}
              >
                비밀번호 변경하기
              </Button>
            </form>

            {/* 뒤로가기 링크 */}
            <div className="text-center mt-6">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-brand-primary transition-colors"
              >
                ← 뒤로가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangePage;
