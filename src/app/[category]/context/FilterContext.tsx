"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { FilterOptions } from "../components/FilterSection";

interface FilterState extends FilterOptions {
  region: string;
  ageGroup: string;
  category: string;
  period: string;
  selectedCategory: string;
}

interface AppliedFilters extends FilterState {
  // 실제 적용된 필터들 (확인 버튼을 눌렀을 때만 적용됨)
  checkApply: boolean;
}

interface FilterContextType {
  // 임시 필터 상태 (사용자가 선택 중인 상태)
  tempFilters: FilterState;
  setTempFilters: (filters: FilterState) => void;
  updateTempFilter: (key: keyof FilterState, value: string) => void;

  // 적용된 필터 상태 (실제 필터링에 사용되는 상태)
  appliedFilters: AppliedFilters;
  applyFilters: () => void;

  // 필터 초기화
  resetFilters: () => void;

  // 필터 적용 여부 확인
  hasUnappliedChanges: () => boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const initialFilterState: FilterState = {
  region: "",
  ageGroup: "",
  category: "",
  period: "",
  selectedCategory: "전체",
};

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [tempFilters, setTempFilters] =
    useState<FilterState>(initialFilterState);
  const [appliedFilters, setAppliedFilters] =
    useState<AppliedFilters>({ ...initialFilterState, checkApply: false });

  const updateTempFilter = useCallback(
    (key: keyof FilterState, value: string) => {
      setTempFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const applyFilters = useCallback(() => {
    setAppliedFilters({ ...tempFilters, checkApply: true });
  }, [tempFilters]);

  const resetFilters = useCallback(() => {
    const resetState = { ...initialFilterState };
    setTempFilters(resetState);
    setAppliedFilters({...resetState, checkApply: false});
  }, []);

  const hasUnappliedChanges = useCallback((): boolean => {
    return JSON.stringify(tempFilters) !== JSON.stringify(appliedFilters);
  }, [tempFilters, appliedFilters]);

  const contextValue: FilterContextType = {
    tempFilters,
    setTempFilters,
    updateTempFilter,
    appliedFilters,
    applyFilters,
    resetFilters,
    hasUnappliedChanges,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterContext must be used within a FilterProvider");
  }
  return context;
};
