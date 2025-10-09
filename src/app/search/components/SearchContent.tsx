"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { MeetingCard } from "../../[category]/components/MeetingCard";
import { MeetingData } from "../../[category]/types";

// 더미 데이터 (실제 프로젝트에서는 API에서 가져옴)
const allMeetings: MeetingData[] = [
  {
    id: "1",
    title: "주말 축구 경기 관람 모임",
    description:
      "함께 축구 경기를 보며 응원하는 모임입니다. 축구를 사랑하는 사람들과 함께해요!",
    image: "⚽",
    category: "축구",
    date: "2024-01-20",
    time: "14:00",
    location: "서울월드컵경기장",
    participants: 15,
    maxParticipants: 20,
    price: "무료",
    isLiked: false,
    tags: ["축구", "응원", "주말"],
    organizer: "축구매니아",
  },
  {
    id: "2",
    title: "야구 경기 직관 모임",
    description:
      "프로야구 경기를 함께 관람하며 치킨과 맥주를 즐기는 모임입니다.",
    image: "⚾",
    category: "야구",
    date: "2024-01-21",
    time: "18:30",
    location: "잠실야구장",
    participants: 8,
    maxParticipants: 12,
    price: "15,000원",
    isLiked: false,
    tags: ["야구", "직관", "맥주"],
    organizer: "야구킹",
  },
  {
    id: "3",
    title: "농구 경기 관람 및 토론",
    description:
      "NBA 경기를 보며 전술과 선수들에 대해 토론하는 깊이 있는 모임입니다.",
    image: "🏀",
    category: "농구",
    date: "2024-01-22",
    time: "20:00",
    location: "카페 농구마니아",
    participants: 6,
    maxParticipants: 10,
    price: "10,000원",
    isLiked: true,
    tags: ["농구", "NBA", "토론"],
    organizer: "농구전문가",
  },
  {
    id: "4",
    title: "배구 경기 단체 관람",
    description:
      "V-리그 경기를 함께 응원하며 배구의 재미를 만끽하는 모임입니다.",
    image: "🏐",
    category: "배구",
    date: "2024-01-23",
    time: "19:00",
    location: "수원실내체육관",
    participants: 12,
    maxParticipants: 16,
    price: "12,000원",
    isLiked: false,
    tags: ["배구", "V리그", "단체관람"],
    organizer: "배구러버",
  },
  {
    id: "5",
    title: "테니스 경기 시청 모임",
    description:
      "윔블던 경기를 함께 시청하며 테니스에 대해 이야기하는 모임입니다.",
    image: "🎾",
    category: "테니스",
    date: "2024-01-24",
    time: "16:00",
    location: "테니스카페 에이스",
    participants: 4,
    maxParticipants: 8,
    price: "8,000원",
    isLiked: false,
    tags: ["테니스", "윔블던", "시청"],
    organizer: "테니스마스터",
  },
  {
    id: "6",
    title: "골프 경기 시청 및 분석",
    description: "PGA 투어 경기를 보며 골프 기술과 전략을 분석하는 모임입니다.",
    image: "⛳",
    category: "골프",
    date: "2024-01-25",
    time: "13:00",
    location: "골프라운지 버디",
    participants: 7,
    maxParticipants: 12,
    price: "20,000원",
    isLiked: true,
    tags: ["골프", "PGA", "분석"],
    organizer: "골프프로",
  },
];

export const SearchContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams!.get("q") || "";

  const [searchResults, setSearchResults] = useState<MeetingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"latest" | "popular" | "price">(
    "latest"
  );
  const [filterCategory, setFilterCategory] = useState<string>("all");

  // 검색 실행
  const performSearch = (searchQuery: string) => {
    setIsLoading(true);

    // 검색어가 없으면 모든 모임 반환
    if (!searchQuery.trim()) {
      setSearchResults(allMeetings);
      setIsLoading(false);
      return;
    }

    // 카테고리명과 모임명 기준으로 검색
    const results = allMeetings.filter((meeting) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        meeting.title.toLowerCase().includes(searchTerm) ||
        meeting.category.toLowerCase().includes(searchTerm) ||
        meeting.description.toLowerCase().includes(searchTerm) ||
        meeting.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    });

    setSearchResults(results);
    setIsLoading(false);
  };

  // 필터링 및 정렬
  const getFilteredAndSortedResults = () => {
    let results = [...searchResults];

    // 카테고리 필터
    if (filterCategory !== "all") {
      results = results.filter(
        (meeting) => meeting.category === filterCategory
      );
    }

    // 정렬
    switch (sortBy) {
      case "popular":
        results.sort((a, b) => b.participants - a.participants);
        break;
      case "price":
        results.sort((a, b) => {
          const priceA =
            a.price === "무료" ? 0 : parseInt(a.price.replace(/[^0-9]/g, ""));
          const priceB =
            b.price === "무료" ? 0 : parseInt(b.price.replace(/[^0-9]/g, ""));
          return priceA - priceB;
        });
        break;
      case "latest":
      default:
        results.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
    }

    return results;
  };

  // 카테고리 목록 추출
  const getCategories = () => {
    const categories = Array.from(
      new Set(allMeetings.map((meeting) => meeting.category))
    );
    return categories;
  };

  useEffect(() => {
    performSearch(query);
  }, [query]);

  const filteredResults = getFilteredAndSortedResults();
  const categories = getCategories();

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="container-custom py-6 sm:py-8">
        {/* 검색 헤더 */}
        <div className="mb-6 sm:mb-8">
          {/* 필터 및 정렬 */}
          <div className="search-filter-container p-3 sm:p-4 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-3 sm:gap-4 items-center w-full sm:w-auto">
                {/* 카테고리 필터 */}
                <div className="flex items-center gap-2 flex-1 sm:flex-none">
                  <Filter className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm flex-1 sm:flex-none"
                  >
                    <option value="all">전체 카테고리</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 정렬 */}
                <div className="flex items-center gap-2 flex-1 sm:flex-none">
                  <SlidersHorizontal className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(
                        e.target.value as "latest" | "popular" | "price"
                      )
                    }
                    className="border border-gray-200 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white shadow-sm flex-1 sm:flex-none"
                  >
                    <option value="latest">최신순</option>
                    <option value="popular">인기순</option>
                    <option value="price">가격순</option>
                  </select>
                </div>
              </div>

              {/* 결과 수 */}
              <div className="text-xs sm:text-sm text-gray-600 bg-purple-50 px-3 py-1.5 rounded-full w-full sm:w-auto text-center">
                총{" "}
                <span className="font-semibold text-purple-600">
                  {filteredResults.length}
                </span>
                개의 모임
              </div>
            </div>
          </div>
        </div>

        {/* 검색 결과 */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="search-loading">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            </div>
            <span className="ml-4 text-gray-600 font-medium">검색 중...</span>
          </div>
        ) : filteredResults.length > 0 ? (
          <div className="search-result-grid">
            {filteredResults.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 bg-white rounded-xl shadow-sm">
            <div className="max-w-md mx-auto px-4">
              <Search className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4 sm:mb-6" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                검색 결과가 없습니다
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
                {query
                  ? `"${query}"에 대한 검색 결과를 찾을 수 없습니다.`
                  : "검색어를 입력해주세요."}
              </p>
              <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 p-3 sm:p-4 rounded-lg">
                💡 검색 팁: 다른 검색어를 시도하거나 카테고리 필터를
                조정해보세요.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
