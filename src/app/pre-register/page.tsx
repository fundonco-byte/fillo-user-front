"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui";
import { ArrowRight, Users } from "lucide-react";
import { Instagram, Youtube } from "lucide-react";
import { NoticeTextBalloon } from "@/components/NoticeTextBalloon";
import { useSession } from "next-auth/react";
import { apiRequest } from "@/lib/api";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/Carousel";

const feedImages = [
  "/assets/images/feed1.png",
  "/assets/images/feed2.png",
  "/assets/images/feed3.png",
  "/assets/images/feed4.png",
  "/assets/images/feed5.png",
];

const totalActivity = [
  "/assets/images/activity1.png",
  "/assets/images/activity2.png",
  "/assets/images/activity3.png",
  "/assets/images/activity4.png",
  "/assets/images/activity5.png",
];

const giftImages = [
  "/assets/images/gift/gift1.png",
  "/assets/images/gift/gift2.png",
  "/assets/images/gift/gift3.png",
];

const activityIntroduceImages = [
  "/assets/images/activity_introduce/activity1.png",
  "/assets/images/activity_introduce/activity2.png",
  "/assets/images/activity_introduce/activity3.png",
  "/assets/images/activity_introduce/activity4.png",
  "/assets/images/activity_introduce/activity5.png",
];

const checkIcon = "/assets/images/check.png";

const PreRegisterPage = () => {
  const [currentUsers, setCurrentUsers] = useState(0); // 현재 등록된 사용자 수
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0); // 활성 탭 상태 (0: 기프티콘, 1: 할인쿠폰, 2: 베타참여)
  const [carouselIndex, setCarouselIndex] = useState(0); // 캐러셀 현재 인덱스
  const { data: session } = useSession();
  const D_DAY = 0; // 임시 지정한 사전등록 마감일까지 남은 Day 수

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

  // 탭 변경 시 캐러셀 인덱스 초기화
  useEffect(() => {
    setCarouselIndex(0);
  }, [activeTab]);

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
      <section className="bg-white  relative overflow-hidden min-h-screen flex items-center">
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

              <div className="text-center flex justify-evenly">
                {/* 사전 등록 마감 일자 알림 텍스트 */}
                <div className="flex flex-col justify-center object-contain">
                  <div className="flex items-center justify-center space-x-3 bg-purple-100 rounded-lg px-4 py-2 inline-flex">
                    <span className="text-gray-900 text-sm">
                      사전 등록 마감 D-{D_DAY}
                    </span>
                  </div>
                </div>

                {/* 캐릭터 이미지 */}
                <div className="w-full flex items-center justify-center">
                  <Image
                    src="/assets/images/character1.png"
                    alt="축구 캐릭터"
                    width={370}
                    height={247}
                    className="object-contain"
                  />
                </div>

                <div className="flex flex-col gap-4 justify-evenly">
                  {/* 현재 등록자 수 */}
                  <div className="flex items-center justify-center space-x-3 bg-purple-100 rounded-lg px-4 py-2 inline-flex">
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

                  {/* 등록 유도 텍스트  */}
                  <div className="flex items-center justify-center space-x-3 bg-purple-100 rounded-lg px-4 py-2 inline-flex">
                    <span className="text-gray-900 text-sm">
                      지금 등록하고 함께 응원해요!
                    </span>
                  </div>
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
            </div>
          </div>
          {/* 아랫방향 화살표 */}
          <div className="flex items-center justify-center h-20 ">
            <ArrowRight className="w-8 h-9 transform -rotate-270 text-brand-primary" />
          </div>
        </div>
      </section>

      {/* 서비스 소개 섹션 */}
      <section className="py-20 bg-gray-100">
        <div className="container-custom">
          <div className="flex flex-row justify-center items-center text-center">
            <div className="text-left ml-10 text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">
                <span className="text-4xl font-bold font-semibold text-brand-primary">
                  스포츠팬
                </span>
                을 위한
                <br />첫 번째 소셜링 플랫폼
              </h2>
            </div>
          </div>

          <div className="max-w-6xl w-full mx-auto">
            {/* 서비스 특징 카드들 */}
            <div className="grid gap-2 mb-6 p-10 w-full rounded-2xl">
              <div className="text-left items-left">
                <h3 className="text-left text-2xl font-semibold text-gray-900 mb-4">
                  필로(Fillo)는,
                </h3>
              </div>

              <div className="flex flex-row gap-8 bg-white p-15 rounded-2xl">
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
                    스포츠 업계 교육
                  </h3>
                </div>
              </div>

              {/* 하단 CTA */}
              <div className="text-center mt-10">
                <p className="text-center text-gray-600 font-semibold  mx-auto">
                  오직{" "}
                  <span className="font-bold text-gray-900">스포츠 팬</span>을
                  대상으로 하는 팬덤 소셜핑 서비스입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 이런 분들 주목 섹션 */}
      <section className="py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-brand-primary mb-12">
              이런 분들 주목
            </h2>

            {/* 동네소식 스크린샷 이미지 영역 */}
            <div className="w-full mx-auto flex items-center justify-center">
              <Image
                src="/assets/images/focus.png"
                alt="실유저 고민 SNS 피드"
                width={1156}
                height={1057}
                className="w-full h-full object-contain rounded-2xl"
              />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mt-12">
              함께 응원할 동료는 필요했지만, 어디서 만나야 할지 막막했죠?
            </h1>
          </div>
        </div>
      </section>

      {/* 실유저 모임 인증 이미지 슬라이더 섹션 */}
      <section className="py-20 bg-gray-100">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto text-center flex flex-col items-center justify-center gap-10">
            <h2 className="text-3xl font-bold mb-6">
              그래서 <span className="text-brand-primary text-bold">FIllo</span>{" "}
              에서는,
            </h2>
            <div className="w-full max-w-6xl mx-auto flex items-center justify-center">
              <Carousel className="w-full h-full">
                <CarouselContent className="-ml-1 gap-1">
                  {feedImages.map((image, index) => {
                    return (
                      <CarouselItem
                        key={index}
                        className="pl-1 md:basis-1/2 lg:basis-1/3"
                      >
                        <Image
                          src={image}
                          alt={`피드 ${index + 1}번째 이미지`}
                          width={354}
                          height={325}
                          className="object-contain max-h-96"
                        />
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mt-12">
              우리 팀 경기를 같이 보러갈 팬들이 당신을 기다리고 있어요!
            </h2>
          </div>
        </div>
      </section>

      {/* 사전 등록 이벤트 섹션 */}
      <section className="py-12 w-full mt-20">
        <div className="w-full">
          <div className="max-w-6xl mx-auto text-center flex flex-col items-center justify-center gap-10">
            {/* 사전 등록 이벤트 타이틀 */}
            <h1 className="text-4xl lg:text-5xl font-black text-purple-700 text-shadow-lg mb-20">
              사전 등록 이벤트
            </h1>

            {/* 탭 메뉴 */}
            <div className="flex justify-center items-center w-full max-w-4xl mx-auto mb-0 gap-2">
              <button
                onClick={() => setActiveTab(0)}
                className={`flex-1 max-w-sm py-4 px-6 text-lg rounded-t-lg transition-all duration-200 ${
                  activeTab === 0
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-300"
                }`}
              >
                기프티콘 추첨 증정
              </button>
              <button
                onClick={() => setActiveTab(1)}
                className={`flex-1 max-w-sm py-4 px-6 text-lg rounded-t-lg transition-all duration-200 ${
                  activeTab === 1
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-300"
                }`}
              >
                첫 소셜링 20% 할인 쿠폰
              </button>
              <button
                onClick={() => setActiveTab(2)}
                className={`flex-1 max-w-sm py-4 px-6 text-lg rounded-t-lg transition-all duration-200 ${
                  activeTab === 2
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-300"
                }`}
              >
                팬덤 그룹 오픈 베타 참여
              </button>
            </div>
          </div>

          <div className="mx-auto text-center w-full bg-purple-600">
            {/* 탭 콘텐츠 */}
            <div className="bg-purple-600 rounded-b-lg rounded-tr-lg w-full mx-auto h-[400px] max-w-6xl">
              {/* Tab 1: 기프티콘 추첨 증정 */}
              {activeTab === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-white">
                  <div className="flex justify-center gap-6 items-center mb-6">
                    {giftImages.map((gift, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-3 shadow-lg relative"
                        style={{ width: "250px", height: "250px" }}
                      >
                        <Image
                          src={gift}
                          alt={`기프티콘 ${index + 1}`}
                          width={226}
                          height={226}
                          className="object-contain w-full h-full rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                  <h2 className="text-xl font-bold text-center text-white">
                    사전 가입자 선착순 100명 중 추첨하여 10분께 기프티콘을
                    보내드립니다.
                  </h2>
                </div>
              )}

              {/* Tab 2: 첫 소셜링 20% 할인 쿠폰 */}
              {activeTab === 1 && (
                <div className="flex flex-col h-full  items-center justify-center text-white w-full">
                  <h2 className="text-xl font-bold text-center mb-6">
                    팬덤 소모임 홍보/관리/검색 베타 서비스 참여 가능
                  </h2>
                  <div className="flex items-center justify-center w-full bg-white p-5 rounded-lg">
                    {/* 좌측 이미지 슬라이더 영역 */}
                    <div className="flex-1 max-w-xl pr-5 pl-5">
                      <div className="overflow-x-auto scrollbar-hide mb-4">
                        <div
                          className="flex gap-4 pb-2"
                          style={{ scrollSnapType: "x mandatory" }}
                        >
                          {activityIntroduceImages.map((image, index) => (
                            <div
                              key={index}
                              className="flex-shrink-0"
                              style={{ scrollSnapAlign: "center" }}
                            >
                              <Image
                                src={image}
                                alt={`활동 소개 ${index + 1}`}
                                width={140}
                                height={175}
                                className="object-cover rounded-lg transition-all duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* 스크롤 진행률 바 */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-white h-2 rounded-full w-1/5 transition-all duration-300"></div>
                      </div>
                    </div>

                    {/* 우측 텍스트 영역 */}
                    <div className="flex-1 text-left space-y-3 max-w-md text-purple-800 pl-5 pr-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <Image
                          src={checkIcon}
                          width={20}
                          height={20}
                          alt="체크"
                        ></Image>
                        <span className="text-lg font-semibold">
                          기본 스포츠 소모임 홍보/모집 해결!
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <Image
                          src={checkIcon}
                          width={20}
                          height={20}
                          alt="체크"
                        ></Image>
                        <span className="text-lg font-semibold">
                          나에게 맞는 소모임/소셜링 찾기!
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        <Image
                          src={checkIcon}
                          width={20}
                          height={20}
                          alt="체크"
                        ></Image>
                        <span className="text-lg font-semibold">
                          다른 팬들과 소통할 이벤트/행사 정보까지!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: 팬덤 그룹 오픈 베타 참여 */}
              {activeTab === 2 && (
                <div className="flex flex-col h-full  items-center justify-center text-white">
                  <h2 className="text-xl font-semibold text-center mb-8">
                    오직 사전 가입자에게만 주어지는 첫 소셜링 20% 쿠폰 이벤트
                  </h2>
                  <div className="flex items-center justify-center w-full gap-6">
                    {/* 좌측 쿠폰 이미지 */}
                    <div className="flex justify-center">
                      <div className="relative rounded-lg max-w-md overflow-hidden">
                        <Image
                          src="/assets/images/coupon.png"
                          alt="쿠폰 배경"
                          width={380}
                          height={280}
                          className=" h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* 우측 텍스트 영역 */}
                    <div className=" bg-white text-purple-800 rounded-lg p-6 max-w-lg">
                      <h3 className="text-2xl font-extrabold mb-4 text-start">
                        Fillo 소셜링 서비스
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={checkIcon}
                            width={20}
                            height={20}
                            alt="체크"
                          ></Image>
                          <span className="text-base font-semibold">
                            {" 직관/ 단관 메이트 해결!"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Image
                            src={checkIcon}
                            width={20}
                            height={20}
                            alt="체크"
                          ></Image>
                          <span className="text-base font-semibold">
                            소모임으로 이어지는 진짜 네트워킹 파티!
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Image
                            src={checkIcon}
                            width={20}
                            height={20}
                            alt="체크"
                          ></Image>
                          <span className="text-base font-semibold">
                            팬덤 모임을 진행할 공간/콘텐츠까지 추가로!
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* fillo 활동 내용 총 정리 섹션 */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center p-10">
            <h1 className="text-3xl font-bold mb-10">
              <span className="text-brand-primary text-bold">Fillo</span> 에서
              할 수 있는 활동 총정리!
            </h1>

            <div>
              <div className="grid grid-cols-3 gap-6 w-full flex items-center justify-center">
                {totalActivity.map((activity, index) => {
                  return (
                    <div key={`activity-${index + 1}`}>
                      <Image
                        src={activity}
                        alt={`활동 ${index + 1}번째 이미지`}
                        width={354}
                        height={325}
                        className="object-contain rounded-2xl max-h-96"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 사전등록 버튼 */}
            {session ? (
              <Button
                variant="deactive"
                size="lg"
                className="px-16 py-4 text-xl font-semibold mt-15 rounded-full transition-all duration-200 shadow-lg"
              >
                사전 등록 완료
              </Button>
            ) : (
              <Button
                onClick={handlePreRegisterClick}
                variant="primary"
                size="lg"
                className="px-16 py-4 text-xl font-semibold mt-15 rounded-full hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                지금 사전 등록하고 혜택 받기
              </Button>
            )}
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
