"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useFilterContext } from "../[category]/context/FilterContext";
import { useCategoryContext } from "../[category]/context/CategoryContext";
import { MeetingCard } from "../[category]/components/MeetingCard";
import { MeetingData } from "../[category]/types";
import SideMenu from "../[category]/components/SideMenu";
import FilterSection, {
  FilterOptions,
} from "../[category]/components/FilterSection";
import { CategoryProvider } from "../[category]/context/CategoryContext";
import { FilterProvider } from "../[category]/context/FilterContext";
import FilterConfirmButton from "../[category]/components/FilterConfirmButton";
import { Menu, X, Users, TrendingUp } from "lucide-react";

// 액티비티와 모임 데이터를 통합한 전체 데이터
const allFandomMeetings: MeetingData[] = [
  // 액티비티 데이터
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
    description:
      "유럽 챔피언스리그 결승전을 함께 보며 축구에 대해 열정적으로 이야기해요.",
    image: "⚽",
    category: "축구",
    date: "2월 1일",
    time: "오후 11시",
    location: "이태원 스포츠바",
    participants: 18,
    maxParticipants: 25,
    price: "₩35,000",
    isLiked: true,
    tags: ["챔피언스리그", "축구", "결승", "시청파티"],
    organizer: "축구광팬",
  },
  {
    id: "13",
    title: "배드민턴 동호회 정기 모임",
    description: "매주 토요일 배드민턴 동호회 정기 모임입니다. 초보자 환영!",
    image: "🏸",
    category: "배드민턴",
    date: "1월 22일",
    time: "오전 9시",
    location: "송파구민체육센터",
    participants: 16,
    maxParticipants: 20,
    price: "₩10,000",
    isLiked: false,
    tags: ["배드민턴", "동호회", "정기모임", "초보환영"],
    organizer: "배드민턴클럽",
  },
  // 모임 데이터
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
  {
    id: "5",
    title: "골프 동호회 정기 라운딩",
    description:
      "매월 첫째 주 토요일 골프 라운딩 모임입니다. 중급자 이상 환영!",
    image: "⛳",
    category: "골프",
    date: "2월 3일",
    time: "오전 7시",
    location: "용인CC",
    participants: 8,
    maxParticipants: 12,
    price: "₩120,000",
    isLiked: false,
    tags: ["골프", "라운딩", "정기모임", "중급"],
    organizer: "골프마스터",
  },
  {
    id: "6",
    title: "네트워킹 파티 - IT업계 모임",
    description:
      "IT업계 종사자들을 위한 네트워킹 파티입니다. 새로운 인맥을 만들어보세요!",
    image: "💼",
    category: "네트워킹",
    date: "1월 30일",
    time: "오후 7시",
    location: "강남 루프탑바",
    participants: 25,
    maxParticipants: 40,
    price: "₩50,000",
    isLiked: true,
    tags: ["네트워킹", "IT", "파티", "인맥"],
    organizer: "IT네트워킹",
  },
  {
    id: "7",
    title: "등산 동호회 - 북한산 정기 산행",
    description:
      "매주 일요일 북한산 정기 산행입니다. 등산 초보자도 환영합니다!",
    image: "🏔️",
    category: "등산",
    date: "1월 28일",
    time: "오전 8시",
    location: "북한산 입구",
    participants: 15,
    maxParticipants: 25,
    price: "₩5,000",
    isLiked: false,
    tags: ["등산", "북한산", "정기산행", "초보환영"],
    organizer: "산악회",
  },
  {
    id: "8",
    title: "족구 동호회 정기 경기",
    description:
      "매주 토요일 족구 경기를 합니다. 실력 무관하고 재미있게 운동해요!",
    image: "⚽",
    category: "족구",
    date: "1월 21일",
    time: "오후 2시",
    location: "한강공원 족구장",
    participants: 12,
    maxParticipants: 16,
    price: "₩8,000",
    isLiked: true,
    tags: ["족구", "정기경기", "한강", "운동"],
    organizer: "족구클럽",
  },
  {
    id: "9",
    title: "비즈니스 모임 - 창업 네트워킹",
    description: "창업을 준비하거나 관심있는 분들의 네트워킹 모임입니다.",
    image: "💡",
    category: "비즈니스",
    date: "2월 5일",
    time: "오후 6시",
    location: "강남 코워킹스페이스",
    participants: 18,
    maxParticipants: 30,
    price: "₩25,000",
    isLiked: false,
    tags: ["창업", "비즈니스", "네트워킹", "스타트업"],
    organizer: "창업모임",
  },
  {
    id: "10",
    title: "신년 파티 - 새해 인사 모임",
    description: "새해를 맞아 함께 인사를 나누고 즐거운 시간을 보내요!",
    image: "🎉",
    category: "파티",
    date: "1월 14일",
    time: "오후 8시",
    location: "홍대 파티룸",
    participants: 30,
    maxParticipants: 50,
    price: "₩40,000",
    isLiked: true,
    tags: ["신년", "파티", "새해", "인사"],
    organizer: "파티플래너",
  },
];

const FandomMeetingsPageContent: React.FC = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const { appliedFilters } = useFilterContext();
  const { selectedCategory } = useCategoryContext();

  // 적용된 필터를 기반으로 모임 데이터 필터링
  const filteredMeetings = useMemo(() => {
    return allFandomMeetings.filter((meeting) => {
      // 카테고리 필터링 (selectedCategory 또는 appliedFilters.selectedCategory 사용)
      const categoryToFilter = !appliedFilters.selectedCategory.includes("전체")
        ? appliedFilters.selectedCategory // <- 나머지 카테고리
        : selectedCategory; // <- 모임 전체 카테고리

      if (
        categoryToFilter &&
        !categoryToFilter.includes("전체") &&
        meeting.category !== categoryToFilter
      ) {
        return false;
      }

      // 지역 필터링
      if (
        appliedFilters.region &&
        !meeting.location.includes(appliedFilters.region)
      ) {
        return false;
      }

      // 연령대 필터링 (예시 - 실제로는 모임 데이터에 연령대 정보가 있어야 함)
      if (appliedFilters.ageGroup) {
        // 여기서는 예시로 간단하게 처리
        // 실제로는 meeting 객체에 ageGroup 필드가 있어야 함
      }

      // 기간 필터링 (예시 - 실제로는 날짜 계산이 필요함)
      if (appliedFilters.period) {
        // 여기서는 예시로 간단하게 처리
        // 실제로는 meeting.date를 파싱하여 기간별로 필터링해야 함
      }

      return true;
    });
  }, [appliedFilters, selectedCategory]);

  const handleToggleSideMenu = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  // 통계 데이터
  const stats = useMemo(() => {
    const totalMeetings = allFandomMeetings.length;
    const totalParticipants = allFandomMeetings.reduce(
      (sum, meeting) => sum + meeting.participants,
      0
    );
    const categories = [...new Set(allFandomMeetings.map((m) => m.category))];

    return {
      totalMeetings,
      totalParticipants,
      totalCategories: categories.length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">팬덤 모임 찾기</h1>
            <p className="text-xl mb-8">
              액티비티와 정기 모임을 한곳에서! 나와 맞는 팬덤 모임을 찾아보세요
            </p>

            {/* 통계 정보 */}
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 mr-2" />
                  <span className="text-2xl font-bold">
                    {stats.totalMeetings}
                  </span>
                </div>
                <p className="text-sm opacity-90">총 모임</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 mr-2" />
                  <span className="text-2xl font-bold">
                    {stats.totalParticipants}
                  </span>
                </div>
                <p className="text-sm opacity-90">참여자</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-2xl font-bold">
                    {stats.totalCategories}
                  </span>
                </div>
                <p className="text-sm opacity-90">카테고리</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* 사이드 메뉴 (데스크톱) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <SideMenu
              menuType="all" // 통합 페이지에서는 all 타입 사용
            />
          </div>

          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            {/* 모바일 필터 버튼 */}
            <div className="lg:hidden mb-6">
              <button
                onClick={handleToggleSideMenu}
                className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Menu className="h-5 w-5" />
                <span>필터</span>
              </button>
            </div>

            {/* 필터 섹션 */}
            <FilterSection totalMeetings={filteredMeetings.length} />

            {/* 확인 버튼 */}
            <div className="mb-6">
              <FilterConfirmButton />
            </div>

            {/* 결과 헤더 */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedCategory === "전체"
                  ? "전체 팬덤 모임"
                  : `${selectedCategory} 모임`}
              </h2>
              <p className="text-gray-600">
                총 {filteredMeetings.length}개의 모임
              </p>
            </div>

            {/* 모임 카드 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeetings.map((meeting) => (
                <MeetingCard key={meeting.id} meeting={meeting} />
              ))}
            </div>

            {/* 모임이 없을 때 */}
            {filteredMeetings.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  조건에 맞는 모임이 없습니다
                </h3>
                <p className="text-gray-600 mb-4">
                  다른 조건으로 검색해보시거나 새로운 모임을 만들어보세요!
                </p>
                <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                  모임 만들기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모바일 사이드 메뉴 오버레이 */}
      {isSideMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleToggleSideMenu}
          />
          <div className="relative w-64 bg-white h-full overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">카테고리</h3>
                <button
                  onClick={handleToggleSideMenu}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <SideMenu menuType="activity" />
          </div>
        </div>
      )}
    </div>
  );
};

export default function FandomMeetingsPage() {
  return (
    <CategoryProvider initialMenuType="activity">
      <FilterProvider>
        <FandomMeetingsPageContent />
      </FilterProvider>
    </CategoryProvider>
  );
}
