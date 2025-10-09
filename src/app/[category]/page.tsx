"use client";

import React, { useState, useMemo, useEffect } from "react";
import { MeetingCard } from "./components/MeetingCard";
import { MeetingData } from "./types";
import SideMenu from "./components/SideMenu";
import FilterSection, { FilterOptions } from "./components/FilterSection";
import { Menu, X } from "lucide-react";
import {
  CategoryProvider,
  useCategoryContext,
  MenuType,
} from "./context/CategoryContext";

// 카테고리별 모임 데이터
const meetingsByCategory: Record<string, MeetingData[]> = {
  홈: [
    {
      id: "1",
      title: "FC서울 vs 강원FC 함께 보기",
      description:
        "서울월드컵경기장에서 열리는 K리그 경기를 함께 관람해요! 응원용품 제공됩니다.",
      image: "⚽",
      category: "축구",
      date: "1월 15일",
      time: "오후 2시",
      location: "서울월드컵경기장",
      participants: 12,
      maxParticipants: 20,
      price: "₩25,000",
      isLiked: false,
      tags: ["K리그", "응원", "서울", "축구"],
      organizer: "축구매니아",
    },
    {
      id: "2",
      title: "두산 베어스 응원단 모집",
      description:
        "잠실야구장에서 두산 베어스를 함께 응원해요. 치킨과 맥주 포함!",
      image: "⚾",
      category: "야구",
      date: "1월 20일",
      time: "오후 6시 30분",
      location: "잠실야구장",
      participants: 20,
      maxParticipants: 30,
      price: "₩30,000",
      isLiked: true,
      tags: ["KBO", "두산", "야구", "치맥"],
      organizer: "베어스팬",
    },
  ],
  activity: [
    {
      id: "3",
      title: "NBA 플레이오프 단체관람",
      description: "미국 NBA 플레이오프를 대형 스크린으로 함께 시청해요.",
      image: "🏀",
      category: "농구",
      date: "1월 18일",
      time: "오전 10시",
      location: "강남 스포츠바",
      participants: 10,
      maxParticipants: 15,
      price: "₩15,000",
      isLiked: false,
      tags: ["NBA", "농구", "플레이오프", "관람"],
      organizer: "농구러버",
    },
    {
      id: "4",
      title: "테니스 윔블던 결승 시청",
      description:
        "윔블던 테니스 대회 결승전을 함께 보며 테니스에 대해 이야기해요.",
      image: "🎾",
      category: "테니스",
      date: "1월 25일",
      time: "오후 9시",
      location: "홍대 카페",
      participants: 8,
      maxParticipants: 12,
      price: "₩20,000",
      isLiked: true,
      tags: ["윔블던", "테니스", "결승", "카페"],
      organizer: "테니스매니아",
    },
    {
      id: "11",
      title: "KBO 한화이글스 응원",
      description: "한화이글스 홈경기 응원단 모집! 야구 초보자도 환영합니다.",
      image: "⚾",
      category: "야구",
      date: "1월 27일",
      time: "오후 6시",
      location: "한화생명이글스파크",
      participants: 15,
      maxParticipants: 25,
      price: "₩28,000",
      isLiked: false,
      tags: ["KBO", "한화", "야구", "응원"],
      organizer: "이글스팬",
    },
    {
      id: "12",
      title: "챔피언스리그 결승 시청파티",
      description: "유럽 챔피언스리그 결승을 스포츠바에서 함께 시청해요.",
      image: "⚽",
      category: "축구",
      date: "2월 1일",
      time: "오후 4시",
      location: "홍대 스포츠바",
      participants: 22,
      maxParticipants: 30,
      price: "₩20,000",
      isLiked: true,
      tags: ["챔피언스리그", "축구", "결승", "시청파티"],
      organizer: "축구광",
    },
  ],
  meeting: [
    {
      id: "5",
      title: "배드민턴 동호회 정기 모임",
      description: "매주 화요일 정기 배드민턴 모임. 초보자도 환영합니다!",
      image: "🏸",
      category: "배드민턴",
      date: "1월 22일",
      time: "오후 7시",
      location: "강남 체육관",
      participants: 16,
      maxParticipants: 20,
      price: "₩10,000",
      isLiked: false,
      tags: ["배드민턴", "정기모임", "초보환영", "강남"],
      organizer: "배드민턴클럽",
    },
    {
      id: "6",
      title: "족구 토너먼트 참가팀 모집",
      description:
        "한강공원에서 열리는 족구 토너먼트에 참가할 팀원을 모집합니다.",
      image: "⚪",
      category: "족구",
      date: "1월 28일",
      time: "오후 1시",
      location: "한강공원",
      participants: 12,
      maxParticipants: 16,
      price: "₩5,000",
      isLiked: true,
      tags: ["족구", "토너먼트", "한강", "팀플레이"],
      organizer: "족구왕",
    },
    {
      id: "13",
      title: "등산 동호회 정기 산행",
      description: "북한산 정기 산행 모임. 건강한 주말을 함께해요!",
      image: "🏔️",
      category: "등산",
      date: "2월 3일",
      time: "오전 8시",
      location: "북한산 우이역",
      participants: 18,
      maxParticipants: 25,
      price: "₩8,000",
      isLiked: false,
      tags: ["등산", "북한산", "정기산행", "주말"],
      organizer: "산악회",
    },
  ],
  networking: [
    {
      id: "7",
      title: "스포츠 팬 네트워킹 파티",
      description:
        "다양한 스포츠를 좋아하는 사람들이 모여 네트워킹을 하는 파티입니다.",
      image: "🎉",
      category: "네트워킹",
      date: "1월 30일",
      time: "오후 7시",
      location: "강남 루프탑",
      participants: 40,
      maxParticipants: 60,
      price: "₩35,000",
      isLiked: false,
      tags: ["네트워킹", "파티", "루프탑", "교류"],
      organizer: "스포츠네트워크",
    },
    {
      id: "8",
      title: "골프 비즈니스 네트워킹",
      description:
        "골프를 통한 비즈니스 네트워킹 모임. 18홀 라운딩 후 저녁식사",
      image: "⛳",
      category: "골프",
      date: "2월 3일",
      time: "오전 8시",
      location: "남서울CC",
      participants: 12,
      maxParticipants: 16,
      price: "₩120,000",
      isLiked: true,
      tags: ["골프", "비즈니스", "네트워킹", "라운딩"],
      organizer: "골프비즈니스",
    },
    {
      id: "14",
      title: "스포츠 스타트업 네트워킹",
      description: "스포츠 관련 스타트업 종사자들의 네트워킹 모임입니다.",
      image: "💼",
      category: "비즈니스",
      date: "2월 7일",
      time: "오후 6시 30분",
      location: "강남 코워킹스페이스",
      participants: 25,
      maxParticipants: 40,
      price: "₩25,000",
      isLiked: false,
      tags: ["스타트업", "비즈니스", "네트워킹", "스포츠테크"],
      organizer: "스포츠테크",
    },
  ],
  events: [
    {
      id: "9",
      title: "스포츠 시상식 후 애프터파티",
      description:
        "2024 한국 스포츠 대상 시상식 참석 후 애프터파티에 참여해요.",
      image: "🏆",
      category: "파티",
      date: "2월 5일",
      time: "오후 9시",
      location: "잠실 롯데호텔",
      participants: 30,
      maxParticipants: 50,
      price: "₩40,000",
      isLiked: false,
      tags: ["시상식", "애프터파티", "롯데호텔", "축하"],
      organizer: "파티플래너",
    },
    {
      id: "10",
      title: "스포츠 박람회 단체 관람",
      description:
        "서울 스포츠 박람회를 단체로 관람하며 최신 스포츠 트렌드를 알아보아요.",
      image: "🎪",
      category: "행사",
      date: "2월 10일",
      time: "오전 10시",
      location: "COEX",
      participants: 35,
      maxParticipants: 50,
      price: "₩15,000",
      isLiked: true,
      tags: ["박람회", "COEX", "트렌드", "단체관람"],
      organizer: "스포츠탐험가",
    },
    {
      id: "15",
      title: "올림픽 기념 마라톤 대회",
      description: "올림픽을 기념하는 시민 마라톤 대회에 함께 참여해요!",
      image: "🏃‍♂️",
      category: "마라톤",
      date: "2월 15일",
      time: "오전 7시",
      location: "한강공원",
      participants: 45,
      maxParticipants: 100,
      price: "₩12,000",
      isLiked: true,
      tags: ["마라톤", "올림픽", "한강", "대회"],
      organizer: "러닝클럽",
    },
  ],
};

// 메뉴 타입에 따른 카테고리 매핑
const menuTypeCategoryMapping: Record<string, MenuType> = {
  activity: "activity",
  meeting: "meeting",
  networking: "meeting", // 네트워킹은 모임 타입으로 처리
  events: "events",
  홈: "activity", // 기본값
};

const categoryDisplayNames: Record<string, string> = {
  홈: "인기 모임",
  activity: "액티비티",
  meeting: "정기 모임",
  networking: "네트워킹",
  events: "이벤트",
};

// 메뉴 타입별 허용된 카테고리 정의
const allowedCategoriesByMenuType: Record<MenuType, string[]> = {
  activity: [
    "축구",
    "야구",
    "농구",
    "테니스",
    "배드민턴",
    "족구",
    "등산",
    "마라톤",
  ],
  meeting: [
    "네트워킹",
    "골프",
    "비즈니스",
    "파티",
    "행사",
    "배드민턴",
    "족구",
    "등산",
  ],
  events: ["파티", "행사", "마라톤", "시상식", "박람회"],
};

// 전체 모임 데이터를 하나의 배열로 합치기
const getAllMeetings = (): MeetingData[] => {
  return Object.values(meetingsByCategory).flat();
};

const CategoryPageContent: React.FC<{
  params: Promise<{ category: string }>;
}> = ({ params }) => {
  const { selectedCategory, setSelectedCategory, menuType, setMenuType } =
    useCategoryContext();
  const [filters, setFilters] = useState<FilterOptions>({
    region: "",
    ageGroup: "",
    category: "",
    period: "",
  });
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  // params를 unwrap
  const [displayName, setDisplayName] = useState<string>("");

  // params 처리를 위한 useEffect
  useEffect(() => {
    params.then(({ category: paramCategory }) => {
      const decodedCategory = decodeURIComponent(paramCategory);
      const categoryDisplayName =
        categoryDisplayNames[decodedCategory] || decodedCategory;

      // 카테고리에 따른 메뉴 타입 설정
      const detectedMenuType =
        menuTypeCategoryMapping[decodedCategory] || "activity";
      setMenuType(detectedMenuType);

      setDisplayName(categoryDisplayName);

      // 메뉴 타입에 따른 초기 카테고리 설정
      const getInitialCategory = (menuType: MenuType): string => {
        switch (menuType) {
          case "activity":
            return "액티비티 전체";
          case "meeting":
            return "모임 전체";
          case "events":
            return "이벤트 전체";
          default:
            return "액티비티 전체";
        }
      };

      setSelectedCategory(getInitialCategory(detectedMenuType));
    });
  }, [params, setSelectedCategory, setMenuType]);

  // 메뉴 타입에 따라 필터링된 모임 데이터
  const menuFilteredMeetings = useMemo(() => {
    const allMeetings = getAllMeetings();
    const allowedCategories = allowedCategoriesByMenuType[menuType];

    return allMeetings.filter((meeting) =>
      allowedCategories.includes(meeting.category)
    );
  }, [menuType]);

  // 카테고리별 필터링된 모임 데이터
  const categoryFilteredMeetings = useMemo(() => {
    if (
      selectedCategory === "전체" ||
      selectedCategory === "액티비티 전체" ||
      selectedCategory === "모임 전체" ||
      selectedCategory === "이벤트 전체"
    ) {
      return menuFilteredMeetings;
    }

    // 특정 카테고리가 선택된 경우 해당 카테고리의 모임만 반환
    return menuFilteredMeetings.filter(
      (meeting) => meeting.category === selectedCategory
    );
  }, [selectedCategory, menuFilteredMeetings]);

  // 필터가 적용된 최종 모임 데이터
  const filteredMeetings = useMemo(() => {
    return categoryFilteredMeetings.filter((meeting) => {
      // 추가 필터 적용 (지역, 연령대, 기간 등)
      if (filters.category && filters.category !== "전체 카테고리") {
        if (meeting.category !== filters.category) return false;
      }

      // 지역 필터 적용 (location 기반)
      if (filters.region && filters.region !== "전체 지역") {
        if (!meeting.location.includes(filters.region)) return false;
      }

      // 기간 필터 적용 (간단한 구현)
      if (filters.period && filters.period !== "전체 기간") {
        // 실제 구현에서는 더 정교한 날짜 필터링이 필요
        if (filters.period === "이번 주" && !meeting.date.includes("1월"))
          return false;
      }

      return true;
    });
  }, [categoryFilteredMeetings, filters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    // 모바일에서 사이드메뉴 닫기
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSideMenuOpen(false);
    }
  };

  const toggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  // 현재 선택된 카테고리에 따른 표시명 결정
  const getCurrentDisplayName = () => {
    if (
      selectedCategory === "전체" ||
      selectedCategory === "액티비티 전체" ||
      selectedCategory === "모임 전체" ||
      selectedCategory === "이벤트 전체"
    ) {
      return displayName;
    }
    return `${selectedCategory} 모임`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {getCurrentDisplayName()}
              </h1>
              <p className="text-base sm:text-lg text-gray-600">
                {filteredMeetings.length}개의 모임이 있습니다
              </p>
              {selectedCategory !== "전체" &&
                selectedCategory !== "액티비티 전체" &&
                selectedCategory !== "모임 전체" &&
                selectedCategory !== "이벤트 전체" && (
                  <p className="text-sm text-purple-600 mt-1">
                    &apos;{selectedCategory}&apos; 카테고리로 필터링 중
                  </p>
                )}
            </div>

            {/* 모바일 사이드메뉴 토글 버튼 */}
            <button
              onClick={toggleSideMenu}
              className="lg:hidden p-2 rounded-lg border border-gray-300 hover:bg-gray-50 flex-shrink-0"
            >
              {isSideMenuOpen ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* 사이드 메뉴 */}
          <aside
            className={`${
              isSideMenuOpen ? "block" : "hidden"
            } lg:block lg:w-80 flex-shrink-0`}
          >
            <SideMenu
              onItemClick={handleCategorySelect}
              className="sticky top-24"
            />
          </aside>

          {/* 메인 콘텐츠 */}
          <main className="flex-1 min-w-0">
            {/* 필터 섹션 */}
            <FilterSection
              onFiltersChange={handleFilterChange}
              totalMeetings={filteredMeetings.length}
            />

            {/* 모임 그리드 */}
            {filteredMeetings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl sm:text-6xl mb-4">😊</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {selectedCategory === "전체"
                    ? "아직 모임이 없어요"
                    : `${selectedCategory} 관련 모임이 없어요`}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  곧 새로운 모임들이 추가될 예정입니다!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredMeetings.map((meeting) => (
                  <MeetingCard key={meeting.id} meeting={meeting} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* 모바일 사이드메뉴 오버레이 */}
      {isSideMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSideMenu}
        />
      )}
    </div>
  );
};

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  // URL 기반으로 초기 메뉴 타입 결정
  const [initialMenuType, setInitialMenuType] = useState<MenuType>("activity");

  useEffect(() => {
    params.then(({ category: paramCategory }) => {
      const decodedCategory = decodeURIComponent(paramCategory);
      const detectedMenuType =
        menuTypeCategoryMapping[decodedCategory] || "activity";
      setInitialMenuType(detectedMenuType);
    });
  }, [params]);

  return (
    <CategoryProvider initialMenuType={initialMenuType}>
      <CategoryPageContent params={params} />
    </CategoryProvider>
  );
}
