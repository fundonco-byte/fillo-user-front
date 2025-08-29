"use client";

import { Suspense } from "react";
import { SearchContent } from "./components/SearchContent";

// 로딩 컴포넌트
const SearchLoading = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="container-custom py-8">
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        <span className="ml-4 text-gray-600 font-medium">
          검색 페이지 로딩 중...
        </span>
      </div>
    </div>
  </div>
);

const SearchPage = () => {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
};

export default SearchPage;
