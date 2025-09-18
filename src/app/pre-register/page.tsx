"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui";
import { ArrowRight, Users } from "lucide-react";
import { Instagram, Youtube } from "lucide-react";
import { NoticeTextBalloon } from "@/components/NoticeTextBalloon";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";

const PreRegisterPage = () => {
  const [currentUsers, setCurrentUsers] = useState(0); // 현재 등록된 사용자 수
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  // 사전 등록 사용자 수 조회
  useEffect(() => {
    const fetchCurrentUsers = async () => {
      try {
        setLoading(true);
        console.log("[API 호출] 사전 등록 사용자 수 조회");

        const response = await apiRequest("/api/v1/member/pre-registration", {
          method: "GET",
        });

        console.log("[API 응답] 사전 등록 사용자 수:", response);

        if (
          response.statusCode === "FO-200" &&
          typeof response.data === "number"
        ) {
          setCurrentUsers(response.data);
        } else {
          console.warn("[API 경고] 예상과 다른 응답 형식:", response);
          // 응답이 예상과 다르면 기본값 유지
          setCurrentUsers(0);
        }
      } catch (error) {
        console.error("[API 에러] 사전 등록 사용자 수 조회 실패:", error);
        // 에러 발생 시 기본값 유지
        setCurrentUsers(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUsers();
  }, []);

  const handlePreRegisterClick = () => {
    // 회원가입 페이지로 이동
    window.location.href = "/auth/signup";
  };

  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleNotionClick = () => {
    const notionNotice = document.getElementById("notion-ready-notice");
    notionNotice?.classList.remove(
      "opacity-0",
      "scale-90",
      "pointer-events-none"
    );
    notionNotice?.classList.add("opacity-100", "scale-100");

    setTimeout(() => {
      notionNotice?.classList.add(
        "opacity-0",
        "scale-90",
        "pointer-events-none"
      );
      notionNotice?.classList.remove("opacity-100", "scale-100");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 메인 히어로 섹션 */}
      <section className="bg-white relative overflow-hidden min-h-screen flex items-center">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center relative z-10 max-w-4xl mx-auto">
              {/* 브랜드 타이틀 */}
              <h1 className="text-4xl lg:text-5xl font-black text-brand-primary mb-4 tracking-wide">
                FILLO
              </h1>

              {/* 메인 슬로건 */}
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 leading-tight">
                만나다. 공유하다. 응원하다.
              </h2>

              {/* 서비스 설명 */}
              <p className="text-lg lg:text-xl text-gray-600 font-medium mb-8 max-w-2xl mx-auto">
                스포츠 팬들을 위한 맞춤 모임 플랫폼
              </p>

              {/* 캐릭터 이미지 */}
              <div className="text-center">
                <div className="w-full lg:block items-center justify-center">
                  <Image
                    src="/assets/images/character1.png"
                    alt="축구 캐릭터"
                    width={370}
                    height={247}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* 사전등록 버튼 */}
              {session ? (
                <Button
                  variant="deactive"
                  size="lg"
                  className="px-16 py-4 text-xl font-semibold mb-6 rounded-full transition-all duration-200 shadow-lg"
                >
                  사전 등록 완료
                </Button>
              ) : (
                <Button
                  onClick={handlePreRegisterClick}
                  variant="primary"
                  size="lg"
                  className="px-16 py-4 text-xl font-semibold mb-6 rounded-full hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  사전 등록하고 혜택 받기
                </Button>
              )}

              {/* 마케팅 동의 안내 */}
              <p className="text-sm text-gray-600 mb-8 max-w-lg mx-auto">
                필로가 준비한 모임 소식과 할인(최대 20%)을 받아보세요.
                <br />
                (마케팅 수신 동의 필요)
              </p>

              {/* 현재 등록자 수 */}
              <div className="flex items-center justify-center space-x-3 bg-gray-200 rounded-lg px-4 py-2 inline-flex">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-gray-600"></div>
                <span className="text-gray-900 text-sm">
                  {loading ? (
                    <span className="inline-flex items-center">
                      <svg
                        className="animate-spin h-4 w-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      로딩 중...
                    </span>
                  ) : (
                    `${currentUsers.toLocaleString()}명이 함께하고 있어요!`
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 서비스 소개 섹션 */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="flex flex-row justify-between items-end">
            <div className="text-left ml-10">
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                <span className="text-4xl font-bold font-semibold text-brand-primary">
                  스포츠팬
                </span>
                을 위한
                <br />첫 번째 소셜링 플랫폼
              </h2>
            </div>

            <div className="mr-10 mb-5">
              <Image
                src="/assets/images/fillo_logo.png"
                alt="fillo 로고고"
                width={120}
                height={80}
                className="object-contain rounded-2xl"
              />
            </div>
          </div>

          <div className="max-w-6xl w-full mx-auto">
            {/* 서비스 특징 카드들 */}
            <div className="grid gap-8 mb-10 bg-gray-100 p-15 w-full rounded-2xl">
              <div className="text-left items-left">
                <h3 className="text-left text-2xl font-semibold text-gray-900 mb-4">
                  필로(Fillo)는
                </h3>
                <div className="justify-start h-px bg-gray-300 mb-4 w-full"></div>
                <p className="text-left text-gray-700  mx-auto">
                  오직 스포츠 팬을 대상으로 하는 팬덤 소셜핑 서비스입니다.
                </p>
              </div>

              <div className="flex flex-row gap-8">
                <div className="text-center">
                  <div className="w-full h-80 mb-6 flex items-center justify-center">
                    <Image
                      src="/assets/images/character2.png"
                      alt="프로 스포츠 행사 캐릭터"
                      width={358}
                      height={358}
                      className="object-contain rounded-2xl"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    프로 스포츠 행사 및 네트워킹
                  </h3>
                </div>

                <div className="text-center">
                  <div className="w-full h-80 mb-6 flex items-center justify-center">
                    <Image
                      src="/assets/images/character3.png"
                      alt="팬덤 소모임 캐릭터"
                      width={358}
                      height={358}
                      className="object-contain rounded-2xl"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    스포츠 팬덤 소모임
                  </h3>
                </div>

                <div className="text-center">
                  <div className="w-full h-80 mb-6 flex items-center justify-center">
                    <Image
                      src="/assets/images/character4.png"
                      alt="스포츠 교육 캐릭터"
                      width={358}
                      height={358}
                      className="object-contain rounded-2xl"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    스포츠 업계 교육까지
                  </h3>
                </div>
              </div>

              {/* 하단 CTA */}
              <div className="text-center">
                <div className="inline-flex items-center bg-brand-primary text-white px-6 py-3 rounded-full mb-2">
                  <span className="font-semibold">
                    만나다. 공유하다. 응원하다
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 이런 분들 주목 섹션 */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-brand-primary mb-8">
              이런 분들 주목
            </h2>

            <h3 className="text-3xl lg:text-3xl font-semibold text-gray-900 mb-12 leading-tight">
              실제로 당0 동네소식을보면
              <br />
              야구/축구를 보고 싶어하는 분들이 종종 보여요.
            </h3>

            {/* 동네소식 스크린샷 이미지 영역 */}
            <div className="w-full max-w-3xl mx-auto flex items-center justify-center">
              <Image
                src="/assets/images/pre-register1.png"
                alt="동네소식 스크린샷"
                width={756}
                height={757}
                className="object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 혼자 직관 가기 아쉽죠 섹션 */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col justify-between gap-12 items-center">
              <div className="w-full p-20 gap-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-left">
                  "혼자 직관 가기 아쉽죠?"
                </h2>
                <div className="h-20 w-full"></div>
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-right">
                  "우리 팀 경기, 같이 응원하는 사람들과 함께 본다면.."
                </h3>
              </div>

              <div className="text-center lg:text-center w-full">
                <h4 className="text-2xl font-semibold text-brand-primary mb-8">
                  그래서 필로(Fillo)
                </h4>
                <p className="text-3xl lg:text-3xl font-semibold text-gray-900 mb-8">
                  "우리 팀 경기, 같이 보러갈 팬들이 기다리고 있어요."
                </p>
              </div>

              <div className="w-full h-full flex items-center justify-center">
                <Image
                  src="/assets/images/pre-register2.png"
                  alt="함께 응원하는 모습"
                  width={600}
                  height={800}
                  className="object-contain rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 사전 등록 이벤트 섹션 */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-brand-primary mb-6">
              사전 등록 이벤트
            </h2>

            <p className="text-3xl font-semibold text-gray-900 mb-16">
              팬들을 위한 팬덤 소셜링 앱 지금 미리 등록하고 혜택 받아가세요
            </p>

            {/* 혜택 이미지들 */}
            <div className="space-y-20">
              <div>
                <h3 className="text-2xl font-semibold text-brand-primary mb-8">
                  혜택1
                </h3>
                <div className="w-full flex items-center justify-center">
                  <Image
                    src="/assets/images/benefit1.png"
                    alt="혜택1 이미지"
                    width={860}
                    height={787}
                    className="object-contain rounded-2xl max-h-96"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-brand-primary mb-8">
                  혜택2
                </h3>
                <div className="w-full flex items-center justify-center">
                  <Image
                    src="/assets/images/benefit2.png"
                    alt="혜택2 이미지"
                    width={869}
                    height={637}
                    className="object-contain rounded-2xl max-h-96"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-brand-primary mb-8">
                  혜택3
                </h3>
                <div className="w-full flex items-center justify-center mb-8">
                  <Image
                    src="/assets/images/benefit3.png"
                    alt="혜택3 이미지"
                    width={257}
                    height={213}
                    className="object-contain rounded-2xl"
                  />
                </div>

                {/* 추가 혜택 이미지 */}
                <div className="w-full flex items-center justify-center">
                  <Image
                    src="/assets/images/activity-introduce.png"
                    alt="추가 혜택 이미지"
                    width={718}
                    height={731}
                    className="object-contain rounded-2xl max-h-96"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 문의 섹션 */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-brand-primary mb-12">
              저희 펀드온이 궁금하시면
            </h2>

            {/* 문의 링크들 */}
            <div className="flex justify-center space-x-8 mb-12">
              <div className="flex items-center space-x-2">
                <div className="relative group w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div
                    id="notion-ready-notice"
                    className="notion-ready-notice flex absolute left-1/2 -translate-x-1/2 bottom-full mb-2 
           opacity-0 scale-90 pointer-events-none
           transition-all duration-800 ease-out 
           group-active:opacity-100 group-active:scale-100"
                  >
                    <div className="flex items-center justify-center bg-gray-300 text-white text-sm px-3 py-2 rounded shadow-lg">
                      <p className="text-sm text-gray-500 flex flex-col">
                        노션 페이지 준비 중입니다 :)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleNotionClick()}
                    className="active:scale-95 w-10 h-10 hover:bg-white-400 rounded-lg flex items-center justify-center transition-colors"
                    tabIndex={0}
                    aria-label="노션 페이지"
                  >
                    <Image
                      src="/assets/images/notion-logo.png"
                      alt="notion 로고"
                      width={23}
                      height={23}
                      className="object-contain"
                    />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() =>
                      handleLinkClick(
                        "https://www.instagram.com/fundon_official/"
                      )
                    }
                    className="w-10 h-10 hover:bg-pink-400 rounded-lg flex items-center justify-center transition-colors"
                    tabIndex={0}
                    aria-label="인스타그램 팔로우"
                  >
                    <Instagram className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() =>
                      handleLinkClick("https://www.youtube.com/@Fundon4824")
                    }
                    className="w-10 h-10 hover:bg-red-500 rounded-lg flex items-center justify-center transition-colors"
                    tabIndex={0}
                    aria-label="유튜브 구독"
                  >
                    <Youtube className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 맨 위로 이동 버튼 - 오른쪽 하단 고정 */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="cursor-pointer border-2 border-gray-500 fixed bottom-6 right-6 w-14 h-14 bg-brand-gray text-gray-900 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl z-50"
        aria-label="맨 위로 이동"
      >
        <ArrowRight className="w-5 h-5 transform -rotate-90 text-gray-500" />
      </button>
    </div>
  );
};

export default PreRegisterPage;
