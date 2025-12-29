"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   // 사전등록 기간이므로 무조건 사전등록 페이지로 전환시키기
  //   // 이후 메인 프로젝트로 전환 시 삭제
  //   router.replace("/pre-register");
  // }, [session, router]);

  // 세션 로딩 중이거나 로그인되지 않은 경우
  if (session === undefined) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-brand-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">페이지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (session === null) {
    return null; // 리다이렉트 중
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="gradient-bg-primary text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
                🏆 이번 주 HOT한 모임
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                스포츠 열정을 함께할
                <br />
                완벽한 동료를 찾아보세요!
              </h2>
              <p className="text-lg sm:text-xl opacity-90 mb-6">
                AI 매칭으로 만나는 당신만의 스포츠 팬덤 커뮤니티
              </p>
              <button className="bg-white text-purple-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base">
                지금 시작하기
              </button>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 w-80">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    ⚽
                  </div>
                  <div>
                    <h3 className="font-semibold">FC서울 vs 강원FC</h3>
                    <p className="text-sm opacity-80">함께 응원하러 가요!</p>
                  </div>
                </div>
                <div className="flex -space-x-2 mb-3">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-white/30 rounded-full border-2 border-white"
                    ></div>
                  ))}
                  <div className="w-8 h-8 bg-white/30 rounded-full border-2 border-white flex items-center justify-center text-xs">
                    +12
                  </div>
                </div>
                <p className="text-sm opacity-90">24명이 참여 중이에요</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Icons with Slide */}
      <CategorySlider />

      {/* Featured Content Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        {/* 인기 액티비티 */}
        <FeaturedSection
          title="인기 액티비티 🔥"
          subtitle="지금 가장 핫한 스포츠 모임"
          category="액티비티"
          items={[
            {
              id: "activity-1",
              title: "FC서울 vs 강원FC 함께 보기",
              image: "⚽",
              tag: "축구",
              date: "1월 15일",
              participants: "12명 참여",
              price: "₩25,000",
            },
            {
              id: "activity-2",
              title: "두산 베어스 응원단 모집",
              image: "⚾",
              tag: "야구",
              date: "1월 20일",
              participants: "20명 참여",
              price: "₩30,000",
            },
            {
              id: "activity-3",
              title: "NBA 플레이오프 단체관람",
              image: "🏀",
              tag: "농구",
              date: "1월 18일",
              participants: "10명 참여",
              price: "₩15,000",
            },
            {
              id: "activity-4",
              title: "테니스 윔블던 결승 시청",
              image: "🎾",
              tag: "테니스",
              date: "1월 25일",
              participants: "8명 참여",
              price: "₩20,000",
            },
            {
              id: "activity-5",
              title: "배드민턴 동호회 정기 모임",
              image: "🏸",
              tag: "배드민턴",
              date: "1월 22일",
              participants: "16명 참여",
              price: "₩10,000",
            },
            {
              id: "activity-6",
              title: "족구 토너먼트 참가팀 모집",
              image: "⚪",
              tag: "족구",
              date: "1월 28일",
              participants: "12명 참여",
              price: "₩5,000",
            },
          ]}
        />

        {/* 이번 주 모임 */}
        <FeaturedSection
          title="이번 주 모임 📅"
          subtitle="곧 시작되는 스포츠 모임"
          category="모임"
          items={[
            {
              id: "meeting-1",
              title: "배드민턴 동호회 정기 모임",
              image: "🏸",
              tag: "배드민턴",
              date: "1월 22일",
              participants: "16명 참여",
              price: "₩10,000",
            },
            {
              id: "meeting-2",
              title: "족구 토너먼트 참가팀 모집",
              image: "⚪",
              tag: "족구",
              date: "1월 28일",
              participants: "12명 참여",
              price: "₩5,000",
            },
            {
              id: "meeting-3",
              title: "스포츠 팬 네트워킹 파티",
              image: "🎉",
              tag: "네트워킹",
              date: "1월 30일",
              participants: "40명 참여",
              price: "₩35,000",
            },
            {
              id: "meeting-4",
              title: "스포츠 시상식 후 애프터파티",
              image: "🏆",
              tag: "파티",
              date: "2월 5일",
              participants: "30명 참여",
              price: "₩40,000",
            },
            {
              id: "meeting-5",
              title: "골프 입문자 모임",
              image: "⛳",
              tag: "골프",
              date: "2월 12일",
              participants: "8명 참여",
              price: "₩50,000",
            },
            {
              id: "meeting-6",
              title: "비즈니스 네트워킹 런치",
              image: "💼",
              tag: "비즈니스",
              date: "2월 8일",
              participants: "15명 참여",
              price: "₩25,000",
            },
          ]}
        />

        {/* 추천 콘텐츠 */}
        <FeaturedSection
          title="맞춤 추천 ⭐"
          subtitle="당신을 위한 특별한 모임"
          category="이벤트"
          items={[
            {
              id: "event-1",
              title: "스포츠 박람회 단체 관람",
              image: "🎪",
              tag: "박람회",
              date: "2월 10일",
              participants: "35명 참여",
              price: "₩15,000",
            },
            {
              id: "event-2",
              title: "골프 입문자 모임",
              image: "⛳",
              tag: "골프",
              date: "2월 12일",
              participants: "8명 참여",
              price: "₩50,000",
            },
            {
              id: "event-3",
              title: "e스포츠 관람 모임",
              image: "🎮",
              tag: "e스포츠",
              date: "2월 15일",
              participants: "25명 참여",
              price: "₩20,000",
            },
            {
              id: "event-4",
              title: "마라톤 동호회",
              image: "🏃‍♂️",
              tag: "마라톤",
              date: "2월 18일",
              participants: "15명 참여",
              price: "무료",
            },
            {
              id: "event-5",
              title: "등산 동호회 정모",
              image: "🏔️",
              tag: "등산",
              date: "2월 20일",
              participants: "20명 참여",
              price: "₩8,000",
            },
            {
              id: "event-6",
              title: "스포츠 시상식",
              image: "🏆",
              tag: "시상식",
              date: "2월 25일",
              participants: "50명 참여",
              price: "₩30,000",
            },
          ]}
        />
      </main>
    </div>
  );
}

// Category Slider Component
function CategorySlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // 모든 카테고리 통합
  const allCategories = [
    // 주요 카테고리
    {
      name: "액티비티",
      link: "/activity",
      icon: "⚽",
      color: "bg-green-100 text-green-600",
    },
    {
      name: "정기모임",
      link: "/meeting",
      icon: "🤝",
      color: "bg-violet-100 text-violet-600",
    },
    {
      name: "네트워킹",
      link: "/networking",
      icon: "🎉",
      color: "bg-pink-100 text-pink-600",
    },
    {
      name: "이벤트",
      link: "/events",
      icon: "🏆",
      color: "bg-purple-100 text-purple-600",
    },
    // 스포츠 카테고리
    {
      name: "축구",
      link: "/activity",
      icon: "⚽",
      color: "bg-green-100 text-green-600",
    },
    {
      name: "야구",
      link: "/activity",
      icon: "⚾",
      color: "bg-red-100 text-red-600",
    },
    {
      name: "농구",
      link: "/activity",
      icon: "🏀",
      color: "bg-orange-100 text-orange-600",
    },
    {
      name: "테니스",
      link: "/activity",
      icon: "🎾",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      name: "배드민턴",
      link: "/activity",
      icon: "🏸",
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      name: "족구",
      link: "/activity",
      icon: "⚪",
      color: "bg-gray-100 text-gray-600",
    },
    {
      name: "등산",
      link: "/activity",
      icon: "🏔️",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      name: "마라톤",
      link: "/activity",
      icon: "🏃‍♂️",
      color: "bg-teal-100 text-teal-600",
    },
    // 모임 카테고리
    {
      name: "골프",
      link: "/meeting",
      icon: "⛳",
      color: "bg-lime-100 text-lime-600",
    },
    {
      name: "비즈니스",
      link: "/meeting",
      icon: "💼",
      color: "bg-slate-100 text-slate-600",
    },
    {
      name: "파티",
      link: "/events",
      icon: "🎉",
      color: "bg-fuchsia-100 text-fuchsia-600",
    },
    // 이벤트 카테고리
    {
      name: "행사",
      link: "/events",
      icon: "📅",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      name: "시상식",
      link: "/events",
      icon: "🏆",
      color: "bg-amber-100 text-amber-600",
    },
    {
      name: "박람회",
      link: "/events",
      icon: "🎪",
      color: "bg-rose-100 text-rose-600",
    },
  ];

  const itemsPerSlide = 8;
  const totalSlides = Math.ceil(allCategories.length / itemsPerSlide);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentItems = () => {
    const startIndex = currentSlide * itemsPerSlide;
    const endIndex = startIndex + itemsPerSlide;
    return allCategories.slice(startIndex, endIndex);
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* 슬라이드 버튼 */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={handlePrevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleNextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors"
                disabled={currentSlide === totalSlides - 1}
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </>
          )}

          {/* 카테고리 그리드 */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 sm:gap-6 mx-4 sm:mx-8">
            {getCurrentItems().map((category) => (
              <Link href={category.link} key={category.name}>
                <div className="text-center">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full ${category.color} flex items-center justify-center text-xl sm:text-2xl mb-2 mx-auto cursor-pointer hover:scale-105 transition-transform shadow-md`}
                  >
                    {category.icon}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* 슬라이드 인디케이터 */}
          {totalSlides > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? "bg-purple-600" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Featured Section Component with Slider
function FeaturedSection({
  title,
  subtitle,
  items,
  category,
}: {
  title: string;
  subtitle: string;
  category: string;
  items: Array<{
    id: string;
    title: string;
    image: string;
    tag: string;
    date: string;
    participants: string;
    price: string;
  }>;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(items.length / itemsPerSlide);

  const handleItemClick = (id: string) => {
    router.push(`/meetings/${id}`);
  };

  const handleButtonClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    router.push(`/meetings/${id}`);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentItems = () => {
    const startIndex = currentSlide * itemsPerSlide;
    const endIndex = startIndex + itemsPerSlide;
    return items.slice(startIndex, endIndex);
  };

  return (
    <section className="mb-8 sm:mb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* 슬라이드 버튼 */}
          {totalSlides > 1 && (
            <div className="flex space-x-2">
              <button
                onClick={handlePrevSlide}
                className="bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-colors"
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handleNextSlide}
                className="bg-white shadow-md rounded-full p-2 hover:bg-gray-50 transition-colors"
                disabled={currentSlide === totalSlides - 1}
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
          <a
            href={`/${category}`}
            className="text-purple-600 hover:text-purple-700 font-medium flex items-center"
          >
            더보기 <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>

      {/* 슬라이드 컨테이너 */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div
              key={slideIndex}
              className="w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {items
                .slice(
                  slideIndex * itemsPerSlide,
                  (slideIndex + 1) * itemsPerSlide
                )
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                  >
                    <div className="h-40 sm:h-48 gradient-bg-light flex items-center justify-center text-3xl sm:text-4xl relative group-hover:scale-105 transition-transform duration-300">
                      {item.image}
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                        <span className="inline-block bg-white/90 backdrop-blur-sm text-purple-600 text-xs px-2 py-1 rounded-full font-medium">
                          {item.tag}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate mb-2 group-hover:text-purple-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="space-y-1 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                        <div className="flex items-center justify-between">
                          <span>📅 {item.date}</span>
                          <span className="font-semibold text-purple-600">
                            {item.price}
                          </span>
                        </div>
                        <div>👥 {item.participants}</div>
                      </div>
                      <button
                        onClick={(e) => handleButtonClick(e, item.id)}
                        className="w-full bg-purple-50 text-purple-600 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-purple-100 transition-colors"
                      >
                        자세히 보기
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* 슬라이드 인디케이터 */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? "bg-purple-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
