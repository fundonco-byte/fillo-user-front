"use client";

import {
  ChevronRight,
  Activity,
  Users,
  Network,
  Calendar,
  LucideIcon,
} from "lucide-react";
import { useCategoryContext } from "../context/CategoryContext";
import { useFilterContext } from "../context/FilterContext";

interface SideMenuProps {
  selectedCategory?: string;
  onCategorySelect?: (category: string) => void;
  menuType?: string;
  activeItem?: string;
  onItemClick?: (item: string) => void;
  className?: string;
}

interface MenuItemType {
  category: string;
  icon: LucideIcon | string;
  subcategories?: string[];
}

// 액티비티(운동) 관련 카테고리
const activitySideMenu: MenuItemType[] = [
  {
    category: "모임 전체",
    icon: Activity,
    subcategories: [
      "축구",
      "야구",
      "농구",
      "테니스",
      "배드민턴",
      "족구",
      "등산",
      "마라톤",
    ],
  },
  {
    category: "축구",
    icon: "⚽",
  },
  {
    category: "야구",
    icon: "⚾",
  },
  {
    category: "농구",
    icon: "🏀",
  },
  {
    category: "테니스",
    icon: "🎾",
  },
  {
    category: "배드민턴",
    icon: "🏸",
  },
  {
    category: "족구",
    icon: "⚪",
  },
  {
    category: "등산",
    icon: "🏔️",
  },
  {
    category: "마라톤",
    icon: "🏃‍♂️",
  },
];

// 모임(네트워킹/행사/파티) 관련 카테고리
const meetingSideMenu: MenuItemType[] = [
  {
    category: "모임 전체",
    icon: Users,
    subcategories: ["네트워킹", "골프", "비즈니스", "파티", "행사"],
  },
  {
    category: "네트워킹",
    icon: Network,
  },
  {
    category: "골프",
    icon: "⛳",
  },
  {
    category: "비즈니스",
    icon: "💼",
  },
  {
    category: "파티",
    icon: "🎉",
  },
  {
    category: "행사",
    icon: Calendar,
  },
];

// 이벤트 관련 카테고리
const eventsSideMenu: MenuItemType[] = [
  {
    category: "전체",
    icon: Calendar,
    subcategories: [],
  },
  {
    category: "이벤트 전체",
    icon: Calendar,
    subcategories: ["파티", "행사", "마라톤", "시상식", "박람회"],
  },
  {
    category: "파티",
    icon: "🎉",
  },
  {
    category: "행사",
    icon: Calendar,
  },
  {
    category: "마라톤",
    icon: "🏃‍♂️",
  },
  {
    category: "시상식",
    icon: "🏆",
  },
  {
    category: "박람회",
    icon: "🎪",
  },
];

const SideMenu: React.FC<SideMenuProps> = ({
  selectedCategory: propSelectedCategory,
  onCategorySelect: propOnCategorySelect,
  menuType: propMenuType,
  activeItem,
  onItemClick,
  className = "",
}) => {
  const { menuType: contextMenuType } = useCategoryContext();
  const menuType = propMenuType || contextMenuType;

  // 메뉴 타입에 따른 카테고리 목록 선택
  const getCurrentMenu = (): MenuItemType[] => {
    switch (menuType) {
      case "activity":
        return activitySideMenu;
      case "meeting":
        return meetingSideMenu;
      case "events":
        return eventsSideMenu;
      case "all":
        return activitySideMenu;
      default:
        return activitySideMenu;
    }
  };

  const currentMenu = getCurrentMenu();

  const { selectedCategory: contextSelectedCategory, setSelectedCategory } =
    useCategoryContext();
  const { updateTempFilter } = useFilterContext();

  const selectedCategory = propSelectedCategory || contextSelectedCategory;
  // console.log("selectedCategory : " + selectedCategory);
  // console.log("contextSelectedCategory : ", contextSelectedCategory);

  const handleItemClick = (category: string) => {
    // Context를 통해 선택된 카테고리 업데이트
    setSelectedCategory(category);

    // FilterContext의 임시 필터도 업데이트
    updateTempFilter("selectedCategory", category);

    // Props로 전달된 콜백 호출
    if (propOnCategorySelect) {
      propOnCategorySelect(category);
    }

    if (onItemClick) {
      onItemClick(category);
    }
    // 모바일에서는 메뉴 선택 시 사이드바 닫기
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      // 부모 컴포넌트에서 처리하도록 함
    }
  };

  // 메뉴 타입에 따른 헤더 텍스트
  const getHeaderText = (): string => {
    return "카테고리";
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col ${className}`}
    >
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900">
          {getHeaderText()}
        </h2>
      </div>

      <nav className="p-4 space-y-2 flex-1 overflow-y-auto max-h-[520px] side-menu-scrollbar">
        {currentMenu.map((item) => {
          const isActive =
            selectedCategory === item.category ||
            (item.category.includes("전체") &&
              selectedCategory.includes("전체")); // || menuType === "all"
          const IconComponent =
            typeof item.icon === "string" ? null : (item.icon as LucideIcon);

          return (
            <button
              key={item.category}
              onClick={() => handleItemClick(item.category)}
              className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group ${
                isActive
                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center space-x-3">
                {IconComponent ? (
                  <IconComponent
                    className={`w-5 h-5 ${
                      isActive ? "text-purple-600" : "text-gray-500"
                    }`}
                  />
                ) : (
                  <span className="text-xl">{item.icon as string}</span>
                )}
                <span
                  className={`font-medium text-left ${
                    isActive ? "text-purple-700" : "text-gray-700"
                  }`}
                >
                  {item.category}
                </span>
              </div>
              <ChevronRight
                className={`w-4 h-4 transition-colors ${
                  isActive
                    ? "text-purple-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* 추가 정보 섹션 */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex-shrink-0">
        <div className="text-center">
          <div className="text-2xl mb-2">🎯</div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            나에게 맞는 모임 찾기
          </h3>
          <p className="text-xs text-gray-600 mb-3">
            관심사에 맞는 모임을 찾아보세요
          </p>
          <button className="w-full bg-purple-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
            모임 추천 받기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
