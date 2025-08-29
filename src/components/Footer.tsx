"use client";

import { Users, Instagram, Twitter, Youtube, Facebook } from "lucide-react";
import filloLogo from "@/assets/images/fillo_logo.png";
import Image from "next/image";

const Footer = () => {
  const handleLinkClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom">
        {/* 메인 푸터 콘텐츠 */}
        <div className="py-16">
          <div className="grid md:grid-cols-4 gap-8">
            {/* 브랜드 정보 */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                {/* <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div> */}
                <Image
                  src={filloLogo}
                  alt="Fillo Logo"
                  width={120}
                  height={80}
                  className="object-contain"
                />
                {/* <span className="text-2xl font-bold">Supporters-High</span> */}
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                스포츠를 사랑하는 사람들을 위한 최고의 매칭 플랫폼.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleLinkClick("https://instagram.com")}
                  className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors"
                  tabIndex={0}
                  aria-label="인스타그램 팔로우"
                >
                  <Instagram className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleLinkClick("https://twitter.com")}
                  className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-lg flex items-center justify-center transition-colors"
                  tabIndex={0}
                  aria-label="트위터 팔로우"
                >
                  <Twitter className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleLinkClick("https://youtube.com")}
                  className="w-10 h-10 bg-gray-800 hover:bg-pink-500 rounded-lg flex items-center justify-center transition-colors"
                  tabIndex={0}
                  aria-label="유튜브 구독"
                >
                  <Youtube className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleLinkClick("https://facebook.com")}
                  className="w-10 h-10 bg-gray-800 hover:bg-purple-700 rounded-lg flex items-center justify-center transition-colors"
                  tabIndex={0}
                  aria-label="페이스북 팔로우"
                >
                  <Facebook className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 서비스 링크 */}
            <div>
              <h3 className="text-lg font-semibold mb-6">서비스</h3>
              <ul className="space-y-4">
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    소모임 검색
                  </button>
                </li>
                {/* <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    AI 매칭
                  </button>
                </li> */}
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    네트워킹 파티
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    장소 예약
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    팬덤 커뮤니티
                  </button>
                </li>
              </ul>
            </div>

            {/* 지원 */}
            <div>
              <h3 className="text-lg font-semibold mb-6">지원</h3>
              <ul className="space-y-4">
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    고객센터
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    자주 묻는 질문
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    사용 가이드
                  </button>
                </li>
                {/* <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    안전 가이드라인
                  </button>
                </li> */}
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    신고하기
                  </button>
                </li>
              </ul>
            </div>

            {/* 회사 정보 */}
            <div>
              <h3 className="text-lg font-semibold mb-6">회사</h3>
              <ul className="space-y-4">
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    회사 소개
                  </button>
                </li>
                {/* <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    채용 정보
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    파트너십
                  </button>
                </li>
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    보도자료
                  </button>
                </li> */}
                <li>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    투자자 정보
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2024 Supporters-High. All rights reserved.
              </p>
              <div className="flex space-x-4 text-sm">
                <button className="text-gray-400 hover:text-white transition-colors">
                  개인정보처리방침
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  서비스 이용약관
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  쿠키 정책
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              서울특별시 강남구 테헤란로 123길 45 서포터즈빌딩 6F
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
