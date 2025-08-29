"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Filter, X } from "lucide-react";
import { useCategoryContext } from "../context/CategoryContext";
import { useFilterContext } from "../context/FilterContext";

export interface FilterOptions {
  region: string;
  ageGroup: string;
  category: string;
  period: string;
}

interface FilterSectionProps {
  filters?: FilterOptions;
  onFiltersChange?: (filters: FilterOptions) => void;
  totalMeetings?: number;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  filters: externalFilters,
  onFiltersChange,
  totalMeetings = 0,
}) => {
  const { selectedCategory, setSelectedCategory } = useCategoryContext();
  const { tempFilters, updateTempFilter } = useFilterContext();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // 외부에서 전달된 filters가 있으면 사용, 없으면 tempFilters 사용
  const filters = externalFilters || {
    region: tempFilters.region,
    ageGroup: tempFilters.ageGroup,
    category: tempFilters.category,
    period: tempFilters.period,
  };

  // Context의 selectedCategory 변경 시 tempFilters.category 동기화
  useEffect(() => {
    const categoryForFilter =
      selectedCategory === "전체" ||
      selectedCategory === "액티비티 전체" ||
      selectedCategory === "모임 전체"
        ? ""
        : selectedCategory;

    // 현재 tempFilters.category와 다를 때만 업데이트
    if (tempFilters.category !== categoryForFilter) {
      updateTempFilter("category", categoryForFilter);
    }
  }, [selectedCategory, tempFilters.category, updateTempFilter]);

  const regions = [
    "전체 지역",
    "강남구",
    "서초구",
    "용산구",
    "마포구",
    "홍대",
    "강북구",
    "성북구",
    "동대문구",
  ];

  const ageGroups = [
    "전체 연령",
    "20대",
    "30대",
    "40대",
    "50대 이상",
    "20-30대",
    "30-40대",
  ];

  const categories = [
    "전체 카테고리",
    "축구",
    "야구",
    "농구",
    "테니스",
    "배드민턴",
    "족구",
    "등산",
    "네트워킹",
    "골프",
    "비즈니스",
    "파티",
    "행사",
    "마라톤",
  ];

  const periods = [
    "전체 기간",
    "오늘",
    "이번 주",
    "이번 달",
    "다음 달",
    "주말만",
    "평일만",
  ];

  const handleFilterSelect = (
    filterType: keyof FilterOptions,
    value: string
  ) => {
    const newValue =
      value === `전체 ${getFilterLabel(filterType)}` ? "" : value;

    // 카테고리 필터의 경우 Context도 업데이트
    if (filterType === "category") {
      const categoryForContext = newValue === "" ? "전체" : newValue;
      setSelectedCategory(categoryForContext);
      updateTempFilter("selectedCategory", categoryForContext);
    }

    // FilterContext의 임시 필터 업데이트
    updateTempFilter(filterType, newValue);

    // 외부 onFiltersChange가 있으면 호출 (하위 호환성)
    if (onFiltersChange) {
      const newFilters = {
        ...filters,
        [filterType]: newValue,
      };
      onFiltersChange(newFilters);
    }

    setOpenDropdown(null);
  };

  const getFilterLabel = (filterType: keyof FilterOptions): string => {
    switch (filterType) {
      case "region":
        return "지역";
      case "ageGroup":
        return "연령";
      case "category":
        return "카테고리";
      case "period":
        return "기간";
      default:
        return "";
    }
  };

  const getFilterOptions = (filterType: keyof FilterOptions): string[] => {
    switch (filterType) {
      case "region":
        return regions;
      case "ageGroup":
        return ageGroups;
      case "category":
        return categories;
      case "period":
        return periods;
      default:
        return [];
    }
  };

  const getFilterDisplayValue = (filterType: keyof FilterOptions): string => {
    const value = filters[filterType];
    return value || `전체 ${getFilterLabel(filterType)}`;
  };

  const clearAllFilters = () => {
    // 카테고리 필터 초기화 시 Context도 초기화
    setSelectedCategory("전체");
    updateTempFilter("selectedCategory", "전체");
    updateTempFilter("region", "");
    updateTempFilter("ageGroup", "");
    updateTempFilter("category", "");
    updateTempFilter("period", "");

    // 외부 onFiltersChange가 있으면 호출 (하위 호환성)
    if (onFiltersChange) {
      const clearedFilters = {
        region: "",
        ageGroup: "",
        category: "",
        period: "",
      };
      onFiltersChange(clearedFilters);
    }
  };

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== ""
  );

  const toggleDropdown = (filterType: string) => {
    setOpenDropdown(openDropdown === filterType ? null : filterType);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">필터</h3>
          <span className="text-sm text-gray-500">
            ({totalMeetings}개 모임)
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-4 w-4" />
            <span>전체 초기화</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(["region", "ageGroup", "category", "period"] as const).map(
          (filterType) => (
            <div key={filterType} className="relative">
              <button
                onClick={() => toggleDropdown(filterType)}
                className={`w-full px-4 py-3 text-left border rounded-lg hover:border-purple-600 transition-colors flex items-center justify-between ${
                  filters[filterType]
                    ? "border-purple-600 bg-purple-50 text-purple-600"
                    : "border-gray-300 text-gray-700"
                }`}
              >
                <span className="text-sm font-medium truncate">
                  {getFilterDisplayValue(filterType)}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    openDropdown === filterType ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openDropdown === filterType && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                  {getFilterOptions(filterType).map((option) => (
                    <button
                      key={option}
                      onClick={() => handleFilterSelect(filterType, option)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                        getFilterDisplayValue(filterType) === option
                          ? "bg-purple-50 text-purple-600 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* 활성 필터 표시 */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>활성 필터:</span>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(
                ([key, value]) =>
                  value && (
                    <span
                      key={key}
                      className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium"
                    >
                      {getFilterLabel(key as keyof FilterOptions)}: {value}
                      <button
                        onClick={() =>
                          handleFilterSelect(key as keyof FilterOptions, "")
                        }
                        className="ml-2 hover:text-purple-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
