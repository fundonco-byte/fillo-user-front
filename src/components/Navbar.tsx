"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut as signOutKakao } from "next-auth/react";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import filloLogo from "@/assets/images/fillo_logo.png";
import LogoutConfirmDialog from "./LogoutConfirmDialog";
import DropDownMenu from "./DropDownMenu";
import { DefaultProfile } from "./ui";

const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  // 세션 업데이트 시 디버깅 로그
  React.useEffect(() => {
    if (session?.user?.profileImage) {
      // console.log(
      //   "Navbar에서 감지된 프로필 이미지:",
      //   session.user.profileImage
      // );
    }
  }, [session?.user?.profileImage]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    signOutKakao({ callbackUrl: "/" });
  };

  const handleLogoutCancel = () => {
    setIsLogoutDialogOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center py-4">
          {/* 로고 */}
          {/* <Link href="/" className="flex items-center space-x-2">
            <div className="w-120 h-10 flex items-center justify-start">
              <Image
                src={filloLogo}
                alt="Fillo Logo"
                width={120}
                height={80}
                className="object-contain"
              />
            </div>
          </Link> */}

          <div className="w-120 h-10 flex items-center justify-start">
            <Link
              href="/pre-register"
              className="flex items-center space-x-2 mr-10 text-brand-gray-900"
            >
              <Image
                src={"/assets/images/fillo_logo.png"}
                alt="Fillo Logo"
                width={120}
                height={80}
                className="object-contain"
              />
            </Link>
            <h5 className="font-bold">내가 찾던 팬덤 모임, Fillo</h5>
          </div>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center space-x-8">
            {/* <Link
              href="/fandom-meetings"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              팬덤 모임 찾기
            </Link> */}
            {/* <Link
              href="/activity"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              액티비티
            </Link>
            <Link
              href="/meeting"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              모임
            </Link> */}
            {/* <Link
              href="/events"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              이벤트
            </Link> */}
          </div>

          {/* 검색창과 CTA 버튼 - 모바일과 데스크톱 모두 표시 */}
          <div className="flex items-center space-x-4">
            {/* 검색창 */}
            {/* <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="모임 검색..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                />
              </div>
            </form> */}

            {session ? (
              <div>
                <DropDownMenu
                  onLogout={handleLogoutClick}
                  profileImage={
                    session.user?.profileImage || session.user?.image ? (
                      <img
                        key={session.user.profileImage || session.user.image} // 강제 리렌더링을 위한 key 추가
                        src={
                          session.user.profileImage || session.user.image || ""
                        }
                        className="w-10 h-10 rounded-full flex items-center justify-center mx-auto cursor-pointer hover:scale-105 transition-transform shadow-md object-cover"
                        alt="Profile"
                        onLoad={() => {
                          // console.log(
                          //   "프로필 이미지 로드됨:",
                          //   session.user?.profileImage || session.user?.image
                          // );
                        }}
                        onError={() => {
                          // console.log("프로필 이미지 로드 실패");
                        }}
                      />
                    ) : (
                      <div className="cursor-pointer hover:scale-105 transition-transform">
                        <DefaultProfile size="md" />
                      </div>
                    )
                  }
                />
              </div>
            ) : (
              <button
                onClick={() => router.push("/auth/login")}
                className="btn-login font-semibold text-sm justify-center hover:shadow-lg transform hover:scale-100 transition-all duration-200"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 로그아웃 확인 다이얼로그 */}
      {isLogoutDialogOpen ? (
        <LogoutConfirmDialog
          isOpen={isLogoutDialogOpen}
          onClose={handleLogoutCancel}
          onConfirm={handleLogoutConfirm}
        />
      ) : null}
    </nav>
  );
};

export default Navbar;
