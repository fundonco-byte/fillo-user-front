"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// 메뉴 타입 정의
export type MenuType = "activity" | "meeting" | "events";

interface CategoryContextType {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSubCategory: string;
  setSelectedSubCategory: (subCategory: string) => void;
  menuType: MenuType;
  setMenuType: (menuType: MenuType) => void;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error(
      "useCategoryContext must be used within a CategoryProvider"
    );
  }
  return context;
};

interface CategoryProviderProps {
  children: ReactNode;
  initialMenuType?: MenuType;
}

export const CategoryProvider: React.FC<CategoryProviderProps> = ({
  children,
  initialMenuType = "activity",
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<string>("액티비티 전체");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("");
  const [menuType, setMenuType] = useState<MenuType>(initialMenuType);

  const value = {
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    menuType,
    setMenuType,
  };

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};
