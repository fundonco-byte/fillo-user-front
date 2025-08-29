"use client";

import React from "react";
import { Check, RotateCcw } from "lucide-react";
import { useFilterContext } from "../context/FilterContext";

interface FilterConfirmButtonProps {
  className?: string;
}

const FilterConfirmButton: React.FC<FilterConfirmButtonProps> = ({
  className = "",
}) => {
  const {
    applyFilters,
    resetFilters,
    hasUnappliedChanges,
    tempFilters,
    appliedFilters,
  } = useFilterContext();

  const hasChanges = hasUnappliedChanges();
  const hasActiveFilters = Object.values(appliedFilters).some(
    (filter) => filter !== "" && filter !== "전체"
  );

  const handleApplyFilters = () => {
    applyFilters();
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  // 활성 필터 개수 계산
  const getActiveFilterCount = () => {
    let count = 0;
    if (tempFilters.region) count++;
    if (tempFilters.ageGroup) count++;
    if (tempFilters.category) count++;
    if (tempFilters.period) count++;
    if (tempFilters.selectedCategory && tempFilters.selectedCategory !== "전체")
      count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* 필터 적용 버튼 */}
      <button
        onClick={handleApplyFilters}
        disabled={!hasChanges}
        className={`
          flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 
          ${
            hasChanges
              ? "bg-purple-600 text-white hover:bg-purple-700 shadow-md hover:shadow-lg transform hover:scale-105"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }
        `}
      >
        <Check className="h-5 w-5" />
        <span>
          필터 적용
          {activeFilterCount > 0 && (
            <span className="ml-1 bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
              {activeFilterCount}
            </span>
          )}
        </span>
      </button>

      {/* 초기화 버튼 */}
      {hasActiveFilters && (
        <button
          onClick={handleResetFilters}
          className="flex items-center space-x-2 px-4 py-3 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
        >
          <RotateCcw className="h-4 w-4" />
          <span>초기화</span>
        </button>
      )}

      {/* 상태 표시 */}
      {hasChanges && (
        <div className="flex items-center space-x-2 text-sm text-orange-600">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          <span>필터 변경사항이 있습니다</span>
        </div>
      )}
    </div>
  );
};

export default FilterConfirmButton;
