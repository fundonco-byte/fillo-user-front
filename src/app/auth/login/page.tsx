"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import filloLogo from "@/assets/images/fillo_logo.png";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        // 로그인 성공 시 사전 등록 메인 페이지로 이동
        router.push("/pre-register");
      } else {
        // 로그인 실패 시 에러 모달 표시
        setShowErrorModal(true);
        // 이메일 입력 칸에 포커스
        setTimeout(() => {
          emailInputRef.current?.focus();
        }, 100);
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      setShowErrorModal(true);
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    emailInputRef.current?.focus();
  };

  // 카카오 로그인이 완료되면 메인 페이지로 이동
  // 일반 이메일 로그인일 경우 별도로 확인 후 라우팅 처리 로직 필요
  // useEffect(() => {
  //   if (status === "authenticated") {
  //     router.push("/");
  //   }
  // }, [status, router]);

  return (
    <div className="min-h-screen gradient-bg-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* 로그인 카드 */}
      <div className="max-w-md w-full space-y-8">
        {/* 로그인 폼 카드 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 card-hover">
          {/* 로고와 제목 */}
          <div className="text-center mb-8">
            <Image
              src={filloLogo}
              alt="Fillo Logo"
              width={120}
              height={40}
              className="mx-auto mb-6 object-contain"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              내가 찾던 그 팬덤 모임
            </h1>
            <p className="text-sm text-gray-600 font-medium font-bold">
              <span className="text-brand-secondary font-bold">
                함께 만나고, 공유하고, 응원하면 더 특별해질 거야
              </span>
            </p>
          </div>

          {/* 로그인 폼 */}
          <form className="space-y-6" onSubmit={handleEmailLogin}>
            {/* 이메일 입력 */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                이메일
              </label>
              <input
                ref={emailInputRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={handleEmailChange}
                placeholder="이메일을 입력하세요"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                비밀번호
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                />
                <button
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors"
                  tabIndex={0}
                  aria-label={
                    showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary text-lg font-semibold justify-center hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* 구분선 */}
          <div className="mt-6 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  또는
                </span>
              </div>
            </div>
          </div>

          {/* 카카오 로그인 버튼 */}
          {/* 현재 사전등록 기간 중이므로 callbackUrl을 /pre-register로 설정 */}
          {/* 이후 메인 프로젝트로 전환 시 callbackUrl을 /로 설정 */}
          <button
            onClick={() => signIn("kakao", { callbackUrl: "/pre-register" })}
            className="w-full bg-yellow-400 text-gray-900 py-3 px-4 rounded-xl font-semibold text-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            <span className="text-xl">💬</span>
            카카오로 로그인
          </button>

          {/* 회원가입 링크 */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              아직 계정이 없으신가요?{" "}
              <Link
                href="/auth/signup"
                className="text-brand-primary font-semibold hover:text-brand-primary-dark transition-colors underline"
              >
                회원가입 하기
              </Link>
            </p>
          </div>
        </div>

        {/* 추가 정보 */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            로그인하면 Fillo의{" "}
            <a
              href="#"
              className="text-brand-primary hover:text-brand-primary-dark transition-colors"
            >
              이용약관
            </a>
            과{" "}
            <a
              href="#"
              className="text-brand-primary hover:text-brand-primary-dark transition-colors"
            >
              개인정보처리방침
            </a>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>

        {/* 에러 모달 */}
        {showErrorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                로그인 실패
              </h3>
              <p className="text-gray-600 mb-6">
                입력한 정보와 일치하는 계정이 존재하지 않습니다
              </p>
              <button
                onClick={handleCloseErrorModal}
                className="w-full btn-primary"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
