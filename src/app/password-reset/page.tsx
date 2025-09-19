"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button, TextInput } from "@/components/ui";
import { Mail, Clock, Shield } from "lucide-react";
import { formatTime } from "@/lib/utils";

const PasswordResetPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [storedAuthCode, setStoredAuthCode] = useState("");
  const [error, setError] = useState("");

  // 세션에서 이메일 가져오기
  useEffect(() => {
    if (session?.user?.email) {
      setEmail(session.user.email);
    } else {
      router.push("/auth/login");
    }
  }, [session, router]);

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

  const handleSendVerificationCode = async () => {
    if (!email) {
      setError("이메일이 필요합니다.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://1.234.75.29:8093/api/v1/member/email/authorize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const result = await response.json();

      if (result.statusCode === "FO-200") {
        setStoredAuthCode(result.data);
        setIsCodeSent(true);
        setTimer(180); // 3분 = 180초
        alert("인증 코드가 전송되었습니다. 3분 내에 입력해주세요.");
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
      // 인증 성공 - 비밀번호 재설정 페이지로 이동
      router.push("/password-change");
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

  const handleResendCode = () => {
    setVerificationCode("");
    setError("");
    handleSendVerificationCode();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container-custom">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* 헤더 */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                비밀번호 찾기
              </h1>
              <p className="text-gray-600">
                이메일 인증을 통해 비밀번호를 재설정하세요
              </p>
            </div>

            {/* 이메일 입력 */}
            <div className="mb-6">
              <TextInput
                label="이메일"
                type="email"
                value={email}
                placeholder={session?.user?.email || "이메일을 입력해주세요"}
                disabled={true}
                helperText="현재 로그인한 계정의 이메일입니다"
              />
            </div>

            {/* 인증 코드 전송 버튼 */}
            {!isCodeSent ? (
              <Button
                onClick={handleSendVerificationCode}
                variant="primary"
                size="lg"
                className="w-full mb-6"
                isLoading={isLoading}
                leftIcon={<Mail className="w-5 h-5" />}
              >
                이메일 인증
              </Button>
            ) : (
              <div className="space-y-4 mb-6">
                {/* 인증 코드 입력 */}
                <TextInput
                  label="인증 코드"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                    setError("");
                  }}
                  placeholder="인증 코드를 입력해주세요"
                  error={error}
                />

                {/* 타이머와 완료 버튼 */}
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={handleVerifyCode}
                    variant="primary"
                    className="flex-1"
                    disabled={!verificationCode.trim()}
                  >
                    완료
                  </Button>

                  {timer > 0 && (
                    <div className="flex items-center text-accent-error font-medium">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(timer)}
                    </div>
                  )}
                </div>

                {/* 재전송 버튼 */}
                <Button
                  onClick={handleResendCode}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={timer > 0}
                >
                  인증 코드 재전송
                </Button>
              </div>
            )}

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* 안내 메시지 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    이메일을 확인해주세요
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>인증 코드는 3분간 유효합니다</li>
                      <li>스팸 폴더도 확인해주세요</li>
                      <li>코드가 오지 않으면 재전송 버튼을 눌러주세요</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

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

export default PasswordResetPage;
