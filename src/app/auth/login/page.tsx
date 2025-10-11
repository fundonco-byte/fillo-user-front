"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
        router.push("/pre-register");
      } else {
        setShowErrorModal(true);
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

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/pre-register");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-[550px] flex flex-col mx-auto items-center justify-center">
        {/* 로고와 제목 */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <Image
              src="/assets/images/fillo-logo-icon.png"
              alt="Fillo Logo"
              width={64}
              height={64}
              className="object-contain mr-2 w-12 h-12 sm:w-16 sm:h-16"
            />
          </div>
          <p className="text-lg sm:text-xl font-semibold text-[#1a1a1a] mb-4 sm:mb-6">
            만나다, 공유하다, 응원하다
          </p>
          <h3 className="text-2xl sm:text-3xl lg:text-[40px] flex flex-col sm:flex-row items-center justify-center font-extrabold text-[#1a1a1a] leading-tight sm:leading-[48px] mb-2 gap-2">
            <span>내가 찾던 팬덤 모임,</span>
            <Image
              src="/assets/images/fillo_brand_text.png"
              alt="Fillo Logo"
              width={100}
              height={100}
              className="object-contain w-20 h-20 sm:w-24 sm:h-24 lg:w-[100px] lg:h-[100px]"
            />
          </h3>
        </div>

        {/* 로그인 폼 */}
        <div className="space-y-4 sm:space-y-6 w-full max-w-[423px]">
          {/* 아이디 입력 */}
          <div>
            <label className="block text-lg sm:text-xl font-semibold text-[#9400ea] mb-2">
              아이디
            </label>
            <input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="이메일 주소를 입력하세요."
              className="w-full h-11 sm:h-12 px-4 sm:px-5 border-2 border-[#9400ea] rounded-lg text-base sm:text-lg text-[#1a1a1a] placeholder-[#999999] focus:outline-none focus:border-[#9400ea] bg-white"
              required
            />
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label className="block text-lg sm:text-xl font-semibold text-[#9400ea] mb-2">
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                placeholder="비밀번호를 입력하세요."
                className="w-full h-11 sm:h-12 px-4 sm:px-5 pr-12 border-2 border-[#9400ea] rounded-lg text-base sm:text-lg text-[#1a1a1a] placeholder-[#999999] focus:outline-none focus:border-[#9400ea] bg-white"
                required
              />
              <button
                type="button"
                onClick={handleTogglePassword}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-[#999999]" />
                ) : (
                  <Eye className="w-5 h-5 text-[#999999]" />
                )}
              </button>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            onClick={handleEmailLogin}
            disabled={isLoading}
            className="w-full h-12 sm:h-[54px] bg-[#9400ea] text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-[#7e00c6] transition-colors disabled:opacity-50"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>

          {/* 링크들 */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-0 sm:space-x-6 text-sm sm:text-base text-[#999999]">
            {/* <Link href="/find-id" className="hover:text-[#1a1a1a]">
              아이디 찾기
            </Link>
            <span>|</span> */}
            <Link href="/password-reset" className="hover:text-[#1a1a1a]">
              비밀번호 찾기
            </Link>
            <span>|</span>
            <Link href="/auth/signup" className="hover:text-[#1a1a1a]">
              회원가입
            </Link>
          </div>

          {/* 카카오 로그인 버튼 */}
          {/* <button
            onClick={() => signIn("kakao", { callbackUrl: "/pre-register" })}
            className="w-full h-[54px] bg-[#fee500] text-black text-base font-semibold rounded-xl hover:bg-[#fdd835] transition-colors flex items-center justify-center gap-2"
          >
            <span className="text-lg">💬</span>
            카카오로 로그인
          </button> */}
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
                className="w-full bg-[#9400ea] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#7e00c6] transition-colors"
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
