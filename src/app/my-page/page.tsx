"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DefaultProfile } from "@/components/ui";
import {
  User,
  Mail,
  Calendar,
  Edit,
  Key,
  MessageCircle,
  Users,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { createHeaders } from "@/lib/api";
import Image from "next/image";
import KakaoChatButton from "@/components/KakaoChatButton";

// 날짜 형식을 안전하게 변환하는 유틸리티 함수
const formatDateSafely = (dateValue: string | null | undefined): string => {
  if (!dateValue) return "등록되지 않음";

  console.log("formatDateSafely 입력값:", dateValue, "타입:", typeof dateValue);

  try {
    // 숫자형 문자열인 경우 (YYYYMMDD 형식)
    if (/^\d{8}$/.test(dateValue)) {
      const year = parseInt(dateValue.substring(0, 4));
      const month = parseInt(dateValue.substring(4, 6)) - 1; // JavaScript month는 0부터 시작
      const day = parseInt(dateValue.substring(6, 8));
      const parsedDate = new Date(year, month, day);

      if (!isNaN(parsedDate.getTime()) && year > 1900 && year < 2100) {
        console.log("YYYYMMDD 형식 파싱 성공:", parsedDate);
        return parsedDate.toLocaleDateString("ko-KR");
      }
    }

    // 타임스탬프 형식 처리 (초 단위)
    const numericValue = parseInt(dateValue);
    if (!isNaN(numericValue)) {
      // Unix timestamp (초 단위)인 경우 밀리초로 변환
      if (numericValue > 0 && numericValue < 2147483647) {
        // 2038년 이전
        const timestampDate = new Date(numericValue * 1000);
        if (
          !isNaN(timestampDate.getTime()) &&
          timestampDate.getFullYear() > 1970
        ) {
          console.log("Unix timestamp 파싱 성공:", timestampDate);
          return timestampDate.toLocaleDateString("ko-KR");
        }
      }

      // 밀리초 타임스탬프인 경우
      if (numericValue > 1000000000000) {
        // 2001년 이후
        const timestampDate = new Date(numericValue);
        if (!isNaN(timestampDate.getTime())) {
          console.log("밀리초 timestamp 파싱 성공:", timestampDate);
          return timestampDate.toLocaleDateString("ko-KR");
        }
      }
    }

    // ISO 8601 형식 처리
    const date = new Date(dateValue);
    if (!isNaN(date.getTime()) && date.getFullYear() > 1970) {
      console.log("ISO 형식 파싱 성공:", date);
      return date.toLocaleDateString("ko-KR");
    }

    // YYYY-MM-DD 형식
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      const [year, month, day] = dateValue.split("-");
      const parsedDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );
      if (!isNaN(parsedDate.getTime()) && parseInt(year) > 1970) {
        console.log("YYYY-MM-DD 형식 파싱 성공:", parsedDate);
        return parsedDate.toLocaleDateString("ko-KR");
      }
    }

    // DD/MM/YYYY 형식
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateValue)) {
      const [day, month, year] = dateValue.split("/");
      const parsedDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );
      if (!isNaN(parsedDate.getTime()) && parseInt(year) > 1970) {
        console.log("DD/MM/YYYY 형식 파싱 성공:", parsedDate);
        return parsedDate.toLocaleDateString("ko-KR");
      }
    }

    console.warn("모든 날짜 파싱 시도 실패:", dateValue);
    return "유효하지 않은 날짜";
  } catch (error) {
    console.error("날짜 변환 오류:", error, "입력값:", dateValue);
    return "날짜 형식 오류";
  }
};

interface UserInfo {
  id: string;
  email: string;
  name: string;
  nickName: string;
  gender?: string;
  profileImage?: string;
  birthDate?: string;
  joinDate: string;
  preferredSports: string[];
  leagueId: number;
  leagueName: string;
  teamId: number;
  teamName: string;
  leagueId2: number; // 추가
  teamId2: number; // 추가
  league2Name: string; // 추가
  team2Name: string; // 추가
  personalInfoAgreement: string;
  marketingAgreement: string;
}

const MyPage = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pageRef = useRef<HTMLDivElement>(null);
  const { execute } = useApi();
  const isInitialLoad = useRef(false);

  // 사용자 정보 불러오기 함수
  const fetchUserInfo = async () => {
    try {
      setIsLoading(true);

      const response = await execute("/api/v1/member/info", {
        headers: await createHeaders(true),
        method: "GET",
      });

      const res = response;

      if (typeof res !== "string" && res.statusCode === "FO-200") {
        const userInfo = res.data as UserInfo;
        if (userInfo) {
          console.log("📊 사용자 정보:", userInfo);
          console.log("📊 두 번째 팀 정보:", {
            leagueId2: userInfo.leagueId2,
            teamId2: userInfo.teamId2,
            league2Name: userInfo.league2Name,
            team2Name: userInfo.team2Name,
          });
          setUserInfo(userInfo);
        }
      } else {
        if (res === "Token-Expired") {
          console.error("사용자 정보 불러오기 실패:", res);
          router.push("/auth/login");
        } else {
          console.error("사용자 정보 불러오기 실패:", res.statusMessage);
        }
      }
    } catch (error) {
      console.error("API 호출 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 사용자 정보 불러오기
  useEffect(() => {
    const initializeUserInfo = async () => {
      if (isInitialLoad.current) {
        return;
      }

      // 세션 로딩 중이면 대기
      if (status === "loading") {
        return;
      }

      // 세션이 없고 로딩이 완료된 경우에만 리다이렉트
      if (status === "unauthenticated" || !session) {
        router.push("/auth/login");
        return;
      }

      await fetchUserInfo();
      isInitialLoad.current = true;
    };

    initializeUserInfo();
  }, [session, status, router, execute]);

  const handlePasswordReset = () => {
    router.push("/password-reset");
  };

  const handleKakaoInquiry = () => {
    // 카카오톡 문의 링크 또는 팝업 등의 기능 구현
    window.open("https://pf.kakao.com/", "_blank"); // 실제 카카오톡 채널 링크로 교체 필요
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {status === "loading"
              ? "세션을 확인하는 중..."
              : "사용자 정보를 불러오는 중..."}
          </p>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">사용자 정보를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          {/* 페이지 헤더 */}
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8 card-hover">
            <div className="flex flex-col items-center justify-center text-center mb-6 sm:mb-8">
              <div className="relative flex-shrink-0 mb-4 sm:mb-6">
                {userInfo.profileImage ? (
                  <img
                    src={userInfo.profileImage}
                    alt="프로필"
                    className="w-40 h-40 sm:w-56 sm:h-56 rounded-full object-cover"
                  />
                ) : (
                  <DefaultProfile
                    size="xl"
                    className="w-40 h-40 sm:w-56 sm:h-56"
                  />
                )}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {userInfo.nickName ? userInfo.nickName : userInfo.name}님의
                  프로필
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  가입일: {formatDateSafely(userInfo.joinDate)}
                </p>
              </div>
            </div>
          </div>

          {/* 읽기 모드 */}
          <div className="space-y-4 sm:space-y-6">
            {/* 기본 정보 */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 card-hover">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  기본 정보
                </h2>
                <button
                  onClick={() => router.push("/profile-edit")}
                  className="flex items-center space-x-2 text-brand-primary hover:text-brand-primary-dark transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm font-medium">수정</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">이름</p>
                    <p className="text-gray-900">{userInfo.name}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">이메일</p>
                    <p className="text-gray-900">{userInfo.email}</p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Users className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">성별</p>
                    <p className="text-gray-900">
                      {userInfo.gender === "M"
                        ? "남성"
                        : userInfo.gender === "F"
                        ? "여성"
                        : "등록되지 않음"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">생년월일</p>
                    <p className="text-gray-900">
                      {formatDateSafely(userInfo.birthDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 응원 팀 정보 */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 card-hover">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                응원 팀 정보
              </h2>
              <div
                className={`grid gap-4 sm:gap-6 ${
                  userInfo.leagueId2 > 0 &&
                  userInfo.teamId2 > 0 &&
                  userInfo.league2Name &&
                  userInfo.league2Name.trim() !== "" &&
                  userInfo.league2Name !== "0" &&
                  userInfo.team2Name &&
                  userInfo.team2Name.trim() !== "" &&
                  userInfo.team2Name !== "0"
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 max-w-xs mx-auto"
                }`}
              >
                {/* 첫 번째 팀 */}
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={(() => {
                        switch (userInfo.leagueName) {
                          case "프리미어리그":
                            return "/assets/images/league/premierleague.png";
                          case "라리가":
                            return "/assets/images/league/laliga.png";
                          case "분데스리가":
                            return "/assets/images/league/bundesliga.png";
                          case "세리에A":
                            return "/assets/images/league/seriea.png";
                          case "리그앙":
                            return "/assets/images/league/league1.png";
                          case "국가대표팀":
                            return "/assets/images/league/national_team.png";
                          case "K리그":
                            return "/assets/images/league/kleague.png";
                          case "기타":
                            return "/assets/images/league/world.png";
                          default:
                            return "/assets/images/freeagent.png";
                        }
                      })()}
                      alt={userInfo.leagueName}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {userInfo.leagueName || "등록되지 않음"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {userInfo.teamName || "등록되지 않음"}
                  </p>
                </div>

                {/* 두 번째 팀 (있는 경우) */}
                {userInfo.leagueId2 > 0 &&
                  userInfo.teamId2 > 0 &&
                  userInfo.league2Name &&
                  userInfo.league2Name.trim() !== "" &&
                  userInfo.league2Name !== "0" &&
                  userInfo.team2Name &&
                  userInfo.team2Name.trim() !== "" &&
                  userInfo.team2Name !== "0" && (
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={(() => {
                            switch (userInfo.league2Name) {
                              case "프리미어리그":
                                return "/assets/images/league/premierleague.png";
                              case "라리가":
                                return "/assets/images/league/laliga.png";
                              case "분데스리가":
                                return "/assets/images/league/bundesliga.png";
                              case "세리에A":
                                return "/assets/images/league/seriea.png";
                              case "리그앙":
                                return "/assets/images/league/league1.png";
                              case "국가대표팀":
                                return "/assets/images/league/national_team.png";
                              case "K리그":
                                return "/assets/images/league/kleague.png";
                              case "기타":
                                return "/assets/images/league/world.png";
                              default:
                                return "/assets/images/freeagent.png";
                            }
                          })()}
                          alt={userInfo.league2Name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {userInfo.league2Name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userInfo.team2Name}
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* 설정 */}
            <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 card-hover">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                설정
              </h2>
              <div className="space-y-4">
                {/* <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <Key className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        비밀번호 변경
                      </h3>
                      <p className="text-sm text-gray-500">
                        계정 보안을 위해 정기적으로 비밀번호를 변경하세요
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handlePasswordReset}
                    className="px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary-dark transition-colors"
                  >
                    변경
                  </button>
                </div> */}

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <h3 className="font-medium text-gray-900">카카오 문의</h3>
                      <p className="text-sm text-gray-500">
                        궁금한 사항이 있으면 카카오톡으로 문의해주세요
                      </p>
                    </div>
                  </div>
                  {/* <button
                    onClick={handleKakaoInquiry}
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-lg font-medium transition-colors"
                  >
                    문의
                  </button> */}
                  <KakaoChatButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
