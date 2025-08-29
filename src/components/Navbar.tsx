"use client";

import { useState, useEffect } from "react";
import { useSession, signOut as signOutKakao } from "next-auth/react";
import { Menu, X, Users, Zap, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import filloLogo from "@/assets/images/fillo_logo.png";
import LogoutConfirmDialog from "./LogoutConfirmDialog";
import DropDownMenu from "./DropDownMenu";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMobileMenuClick = () => {
    setIsMenuOpen(false);
  };

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
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-120 h-10 flex items-center justify-start">
              <Image
                src={filloLogo}
                alt="Fillo Logo"
                width={120}
                height={80}
                className="object-contain"
              />
            </div>
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/fandom-meetings"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              팬덤 모임 찾기
            </Link>
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
            <Link
              href="/events"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              이벤트
            </Link>
          </div>

          {/* 검색창과 CTA 버튼 */}
          <div className="hidden md:flex items-center space-x-4">
            {/* 검색창 */}
            <form onSubmit={handleSearchSubmit} className="relative">
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
            </form>

            {session ? (
              <div>
                <DropDownMenu
                  onLogout={handleLogoutClick}
                  proileImage={
                    <img
                      src={session.user?.image as string}
                      className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto cursor-pointer hover:scale-105 transition-transform shadow-md`}
                      alt="Profile"
                    />
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

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2"
            onClick={handleToggleMenu}
            tabIndex={0}
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {/* 모바일 검색창 */}
              <form onSubmit={handleSearchSubmit} className="px-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="모임 검색..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-sm"
                  />
                </div>
              </form>

              <Link
                href="/fandom-meetings"
                onClick={handleMobileMenuClick}
                className="text-gray-600 hover:text-purple-800 font-medium transition-colors text-left"
              >
                팬덤 모임 찾기
              </Link>
              <Link
                href="/activity"
                onClick={handleMobileMenuClick}
                className="text-gray-600 hover:text-purple-800 font-medium transition-colors text-left"
              >
                액티비티
              </Link>
              <Link
                href="/meeting"
                onClick={handleMobileMenuClick}
                className="text-gray-600 hover:text-purple-800 font-medium transition-colors text-left"
              >
                모임
              </Link>
              <Link
                href="/events"
                onClick={handleMobileMenuClick}
                className="text-gray-600 hover:text-purple-800 font-medium transition-colors text-left"
              >
                이벤트
              </Link>
              <Link
                href="/networking"
                onClick={handleMobileMenuClick}
                className="text-gray-600 hover:text-purple-800 font-medium transition-colors text-left"
              >
                네트워킹
              </Link>
              <Link
                href="/meetings"
                onClick={handleMobileMenuClick}
                className="text-gray-600 hover:text-purple-800 font-medium transition-colors text-left flex items-center space-x-2"
              >
                <Menu className="h-4 w-4" />
                <span>전체 메뉴</span>
              </Link>
              <hr className="border-gray-200" />
              {session ? (
                <button
                  onClick={() => {
                    handleMobileMenuClick();
                    handleLogoutClick();
                  }}
                  className="text-purple-600 font-semibold hover:text-purple-700 transition-colors text-left"
                  tabIndex={0}
                  aria-label="로그아웃"
                >
                  로그아웃
                </button>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={handleMobileMenuClick}
                  className="text-purple-600 font-semibold hover:text-purple-700 transition-colors text-left"
                  tabIndex={0}
                  aria-label="로그인"
                >
                  로그인
                </Link>
              )}
              <button
                className="btn-primary justify-center"
                tabIndex={0}
                aria-label="무료로 시작하기"
              >
                <Zap className="h-4 w-4" />
                무료로 시작하기
              </button>
            </div>
          </div>
        )}
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
