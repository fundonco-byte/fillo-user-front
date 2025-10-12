"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

const PasswordResetPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [storedAuthCode, setStoredAuthCode] = useState("");
  const [error, setError] = useState("");

  // 세션에서 이메일 가져오기 (선택사항)
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    }
    // 로그인하지 않은 상태에서도 비밀번호 찾기 페이지에 접근할 수 있도록 리다이렉트 제거
  }, [session]);

  // 타이머 관리
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsCodeSent(false);
            setStoredAuthCode("");
            setVerificationCode("");
            alert("인증 시간이 만료되었습니다. 다시 인증 후 입력하십시오.");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleSendVerificationCode = async () => {
    if (!email) {
      setError("이메일이 필요합니다.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // [운영]
      // const API_URL = "http://1.234.75.29:8093/api/v1/member/email/authorize";

      // [개발]
      // const API_URL = "http://backend:8093/api/v1/member/email/authorize";

      // [로컬]
      const API_URL = "http://localhost:8093/api/v1/member/email/authorize";

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      const result = await response.json();

      if (result.statusCode === "FO-200") {
        setStoredAuthCode(result.data);
        setIsCodeSent(true);
        setTimer(300); // 5분 = 300초
        alert("인증 코드가 전송되었습니다. 5분 내에 입력해주세요.");
      } else {
        setError(result.message || "인증 코드 전송에 실패했습니다.");
      }
    } catch (error) {
      console.error("API 호출 오류:", error);
      setError("서버 연결에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = () => {
    if (!verificationCode.trim()) {
      setError("인증 코드를 입력해주세요.");
      return;
    }

    if (verificationCode.trim() === storedAuthCode) {
      // 인증 성공
      setIsEmailVerified(true);
      setError("");
      alert("이메일 인증이 완료되었습니다.");
    } else {
      setError("올바르지 않은 인증 값입니다.");
      // 알림 다이얼로그 표시
      if (
        window.confirm("올바르지 않은 인증 값입니다. 다시 시도하시겠습니까?")
      ) {
        setVerificationCode("");
        setError("");
      }
    }
  };

  const handleNextStep = () => {
    if (!isEmailVerified) {
      setError("먼저 이메일 인증을 완료해주세요.");
      return;
    }

    // 인증된 이메일을 세션 스토리지에 저장
    if (typeof window !== "undefined") {
      sessionStorage.setItem("verifiedEmail", email);
    }

    // 비밀번호 변경 페이지로 이동
    router.push("/password-change");
  };

  const handleResendCode = () => {
    setVerificationCode("");
    setError("");
    handleSendVerificationCode();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
      <div className="max-w-[470px] w-full">
        <div className="bg-white">
          {/* 단계 표시 */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="flex items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#9400ea] rounded-full flex items-center justify-center">
                <span className="text-white text-sm sm:text-base font-semibold">
                  1
                </span>
              </div>
              <div className="w-4 sm:w-[19px] h-px bg-[#d9b6f6] mx-1.5 sm:mx-2"></div>
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#d9b6f6] rounded-full flex items-center justify-center">
                <span className="text-white text-sm sm:text-base font-semibold">
                  2
                </span>
              </div>
            </div>
          </div>

          {/* 제목 */}
          <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-[#1a1a1a] text-center mb-8 sm:mb-12 lg:mb-16 leading-tight sm:leading-[62px]">
            본인 인증
          </h2>

          {/* 이메일 입력 */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-base sm:text-lg lg:text-[20px] font-semibold text-[#9400ea] mb-2 leading-tight sm:leading-[26px]">
              아이디
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="회원가입 시 사용한 이메일 주소를 입력하세요."
              className="w-full h-11 sm:h-12 px-4 sm:px-5 border border-[#9400ea] rounded-lg text-[#1a1a1a] placeholder-[#999999] text-base sm:text-lg leading-relaxed sm:leading-[29px] focus:outline-none focus:ring-2 focus:ring-[#9400ea] focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* 인증 코드 입력 */}
          {isCodeSent && (
            <div className="mb-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                    setError("");
                  }}
                  placeholder="인증 번호를 입력하세요."
                  className="flex-1 h-11 sm:h-12 px-4 sm:px-5 border border-[#9400ea] rounded-lg text-[#1a1a1a] placeholder-[#999999] text-base sm:text-lg leading-relaxed sm:leading-[29px] focus:outline-none focus:ring-2 focus:ring-[#9400ea] focus:border-transparent transition-all duration-200"
                />
                <button
                  onClick={handleVerifyCode}
                  disabled={!verificationCode.trim() || isEmailVerified}
                  className={`w-full sm:w-[120px] h-11 sm:h-12 rounded-xl font-semibold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#9400ea] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isEmailVerified
                      ? "bg-green-500 text-white"
                      : "bg-[#9400ea] text-white hover:bg-[#7a00c7]"
                  }`}
                >
                  {isEmailVerified ? "인증 완료" : "이메일 인증"}
                </button>
              </div>
              {!isEmailVerified && timer > 0 && (
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  {formatTime(timer)}
                </p>
              )}
            </div>
          )}

          {/* 비밀번호 입력 - 항상 노출 */}
          <div className="mb-2">
            <div className="flex flex-col sm:flex-row gap-2">
              {!isCodeSent && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="인증 번호를 입력하세요."
                  className="flex-1 h-11 sm:h-12 px-4 sm:px-5 border border-[#9400ea] rounded-lg text-[#1a1a1a] placeholder-[#999999] text-base sm:text-lg leading-relaxed sm:leading-[29px] focus:outline-none focus:ring-2 focus:ring-[#9400ea] focus:border-transparent transition-all duration-200"
                />
              )}
              {!isCodeSent && (
                <button
                  onClick={handleSendVerificationCode}
                  disabled={isLoading || !email.trim()}
                  className="w-full sm:w-[120px] h-11 sm:h-12 bg-[#9400ea] text-white rounded-xl font-semibold text-sm sm:text-base hover:bg-[#7a00c7] focus:outline-none focus:ring-2 focus:ring-[#9400ea] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "전송 중..." : "이메일 인증"}
                </button>
              )}
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="text-xs sm:text-[12px] text-[#1a1a1a] leading-tight sm:leading-[17px] mb-8 sm:mb-12">
            위 이메일 주소로 전송된 인증번호를 입력하세요.
            <br />
            이메일이 오지 않으면 스팸 메일함을 확인하시거나, 이메일 인증을 다시
            눌러주세요.
          </div>

          {/* 다음 버튼 - 항상 노출 */}
          <div className="flex justify-center">
            <button
              onClick={handleNextStep}
              disabled={!isEmailVerified}
              className={`w-full sm:w-4/5 h-12 sm:h-[54px] rounded-xl font-semibold text-sm sm:text-base focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4 sm:mb-6 ${
                isEmailVerified
                  ? "bg-[#9400ea] text-white hover:bg-[#7a00c7]"
                  : "bg-gray-400 text-white"
              }`}
            >
              다음
            </button>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="text-center text-xs sm:text-sm text-red-600 mb-4">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PasswordResetPage;
