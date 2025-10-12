"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { isValidPassword } from "@/lib/utils";
import Image from "next/image";

const PasswordChangePage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
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

  // 세션 스토리지에서 인증된 이메일 가져오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      const verifiedEmail = sessionStorage.getItem("verifiedEmail");
      if (verifiedEmail) {
        setEmail(verifiedEmail);
      } else {
        // 인증된 이메일이 없으면 이전 단계로 리다이렉트
        alert("이메일 인증이 필요합니다. 이전 단계로 이동합니다.");
        router.push("/password-reset");
      }
    }
  }, [router]);

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

    if (!email) {
      alert("이메일 정보가 없습니다. 이전 단계로 이동합니다.");
      router.push("/password-reset");
      return;
    }

    setIsLoading(true);

    try {
      // JSON 형식으로 데이터 준비
      const requestData = {
        email: email,
        password: formData.password,
        checkPassword: formData.checkPassword,
      };

      // 직접 fetch를 사용하여 인증 헤더 없이 API 호출

      // [운영]
      // const API_BASE_URL = "http://1.234.75.29:8093";

      // [개발]
      const API_BASE_URL = "http://1.234.75.29:9093";

      // [로컬]
      // const API_BASE_URL = "http://localhost:8093";

      const response = await fetch(
        `${API_BASE_URL}/api/v1/member/update/password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.statusCode === "FO-200") {
        // 성공 시 세션 스토리지에서 이메일 정보 제거
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("verifiedEmail");
        }
        alert("비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.");
        router.push("/auth/login");
      } else {
        alert(
          `비밀번호 변경에 실패했습니다: ${
            result.statusMessage || "알 수 없는 오류"
          }`
        );
      }
    } catch (error) {
      // console.error("비밀번호 변경 실패:", error);
      alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[400px] w-full">
        <div className="bg-white">
          {/* 단계 표시 */}
          <div className="flex justify-center mb-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#9400ea] rounded-full flex items-center justify-center">
                <span className="text-white text-base font-semibold">1</span>
              </div>
              <div className="w-[19px] h-px bg-[#9400ea] mx-2"></div>
              <div className="w-8 h-8 bg-[#9400ea] rounded-full flex items-center justify-center">
                <span className="text-white text-base font-semibold">2</span>
              </div>
            </div>
          </div>

          {/* 제목 */}
          <h2 className="text-[48px] font-extrabold text-[#1a1a1a] text-center mb-16 leading-[62px]">
            비밀번호 재설정
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 새 비밀번호 */}
            <div>
              <label className="block text-[20px] font-semibold text-[#9400ea] mb-2 leading-[26px]">
                비밀번호 재설정
              </label>
              <p className="text-[12px] text-[#1a1a1a] leading-[17px] mb-4">
                영문, 숫자, 특수문자 포함 8~20자까지 입력하세요.
              </p>

              <div className="relative mb-4">
                <input
                  type={showPasswords.password ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="새로운 비밀번호를 입력하세요."
                  className={`w-full h-12 px-5 pr-12 border border-[#9400ea] rounded-lg text-[#1a1a1a] placeholder-[#999999] text-[18px] leading-[29px] focus:outline-none focus:ring-2 focus:ring-[#9400ea] focus:border-transparent transition-all duration-200 ${
                    errors.password ? "border-red-500 focus:ring-red-500" : ""
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

              {errors.password && (
                <p className="text-sm text-red-600 mb-4">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div className="mb-16">
              <div className="relative mb-6">
                <input
                  type={showPasswords.checkPassword ? "text" : "password"}
                  value={formData.checkPassword}
                  onChange={(e) =>
                    handleInputChange("checkPassword", e.target.value)
                  }
                  placeholder="새로운 비밀번호를 다시 입력하세요."
                  className={`w-full h-12 px-5 pr-12 border border-[#9400ea] rounded-lg text-[#1a1a1a] placeholder-[#999999] text-[18px] leading-[29px] focus:outline-none focus:ring-2 focus:ring-[#9400ea] focus:border-transparent transition-all duration-200 ${
                    errors.checkPassword
                      ? "border-red-500 focus:ring-red-500"
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

              {errors.checkPassword && (
                <p className="text-sm text-red-600 mb-4">
                  {errors.checkPassword}
                </p>
              )}
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={
                  isLoading || !formData.password || !formData.checkPassword
                }
                className="w-4/5 h-[54px] bg-[#9400ea] text-white rounded-xl font-semibold text-base hover:bg-[#7a00c7] focus:outline-none focus:ring-2 focus:ring-[#9400ea] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "변경 중..." : "완료"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangePage;
