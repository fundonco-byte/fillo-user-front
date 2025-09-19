"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button, TextInput, DefaultProfile } from "@/components/ui";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Key,
  MessageCircle,
  Upload,
  X,
  Check,
} from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { createHeaders } from "@/lib/api";
import { League, Team } from "@/types/league";
import Image from "next/image";
import useScript from "@/hooks/useScript";

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

// input[type="date"]용 날짜 형식 변환 함수 (YYYY-MM-DD 형식)
const formatDateForInput = (dateValue: string | null | undefined): string => {
  if (!dateValue) return "";

  console.log(
    "formatDateForInput 입력값:",
    dateValue,
    "타입:",
    typeof dateValue
  );

  try {
    // 숫자형 문자열인 경우 (YYYYMMDD 형식)
    if (/^\d{8}$/.test(dateValue)) {
      const year = dateValue.substring(0, 4);
      const month = dateValue.substring(4, 6);
      const day = dateValue.substring(6, 8);
      const formattedDate = `${year}-${month}-${day}`;

      // 유효성 검증
      const testDate = new Date(formattedDate);
      if (!isNaN(testDate.getTime()) && parseInt(year) > 1900) {
        console.log("YYYYMMDD input 형식 변환 성공:", formattedDate);
        return formattedDate;
      }
    }

    // 타임스탬프 처리
    const numericValue = parseInt(dateValue);
    if (!isNaN(numericValue)) {
      let date: Date;

      // Unix timestamp (초 단위)
      if (numericValue > 0 && numericValue < 2147483647) {
        date = new Date(numericValue * 1000);
      }
      // 밀리초 타임스탬프
      else if (numericValue > 1000000000000) {
        date = new Date(numericValue);
      } else {
        return "";
      }

      if (!isNaN(date.getTime()) && date.getFullYear() > 1970) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const formattedDate = `${year}-${month}-${day}`;
        console.log("timestamp input 형식 변환 성공:", formattedDate);
        return formattedDate;
      }
    }

    // 이미 YYYY-MM-DD 형식인지 확인
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      const testDate = new Date(dateValue);
      if (!isNaN(testDate.getTime())) {
        console.log("이미 올바른 input 형식:", dateValue);
        return dateValue;
      }
    }

    // DD/MM/YYYY 형식
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateValue)) {
      const [day, month, year] = dateValue.split("/");
      const formattedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;
      const testDate = new Date(formattedDate);
      if (!isNaN(testDate.getTime())) {
        console.log("DD/MM/YYYY input 형식 변환 성공:", formattedDate);
        return formattedDate;
      }
    }

    // ISO 날짜 문자열 처리
    const date = new Date(dateValue);
    if (!isNaN(date.getTime()) && date.getFullYear() > 1970) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      console.log("ISO input 형식 변환 성공:", formattedDate);
      return formattedDate;
    }

    console.warn("input 날짜 형식 변환 실패:", dateValue);
    return "";
  } catch (error) {
    console.error("input 날짜 변환 오류:", error, "입력값:", dateValue);
    return "";
  }
};

interface UserInfo {
  id: string;
  email: string;
  name: string;
  nickName: string;
  phone?: string;
  profileImage?: string;
  birthDate?: string;
  address?: string;
  joinDate: string;
  preferredSports: string[];
  leagueId: number;
  leagueName: string;
  teamId: number;
  teamName: string;
  personalInfoAgreement: string;
  marketingAgreement: string;
}

interface DaumPostCode {
  userSelectedType: string,
  roadAddress: string,
  jibunAddress: string
};

const MyPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nickName: "",
    phone: "",
    birthDate: "",
    address: "",
    leagueId: 0,
    leagueName: "",
    teamId: 0,
    teamName: "",
    personalInfoAgreement: "",
    marketingAgreement: "",
  });
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const pageRef = useRef<HTMLDivElement>(null);

  // 다음 우편번호 서비스 스크립트 로드
  useScript("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");
  const { execute } = useApi();
  const isInitialLoad = useRef(false);

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
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

      try {
        // Authorization과 RefreshToken 헤더 설정
        // const authToken = localStorage.getItem("authToken") || "";
        // const refreshToken = localStorage.getItem("refreshToken") || "";

        const response = await execute("/api/v1/member/info", {
          headers: await createHeaders(true),
          method: "GET",
        });

        const res = response;

        if (typeof res !== "string" && res.statusCode === "FO-200") {

          const userInfo = res.data as UserInfo;
          if (userInfo) {
            setUserInfo(userInfo);
            setEditForm({
              nickName: userInfo.nickName || "",
              leagueId: userInfo.leagueId || 0,
              leagueName: userInfo.leagueName || "",
              teamId: userInfo.teamId || 0,
              teamName: userInfo.teamName || "",
              personalInfoAgreement: userInfo.personalInfoAgreement || "",
              marketingAgreement: userInfo.marketingAgreement || "",
              phone: userInfo.phone || "",
              birthDate: formatDateForInput(userInfo.birthDate),
              address: userInfo.address || "",
            });
          }
        } else {
          if (res === "Token-Expired") {
            console.error("사용자 정보 불러오기 실패:", res);
          } else {
            console.error("사용자 정보 불러오기 실패:", res.statusMessage);
          }

          // 토큰이 만료된 경우 로그인 페이지로 리다이렉트
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("API 호출 오류:", error);
      } finally {
        setIsLoading(false);
        isInitialLoad.current = true;
      }
    };

    fetchUserInfo();
  }, [session, status, router, execute]);

  // 리그 목록 가져오기
  const fetchLeagues = async () => {
    try {
      const response = await execute("/api/v1/league/all", {
        method: "GET",
        headers: await createHeaders(false),
      });

      if (typeof response !== "string" && response.statusCode === "FO-200") {
        const leagueData = response.data;
        if (leagueData && Array.isArray(leagueData)) {
          setLeagues(leagueData);
        }
      }
    } catch (error) {
      console.error("리그 목록 불러오기 오류:", error);
    }
  };

  // 팀 목록 가져오기
  const fetchTeams = async (leagueId: number) => {
    if (leagueId === 0) {
      setTeams([{ teamId: 0, teamName: "없음", leagueId: 0 }]);
      return;
    }

    try {
      const response = await execute(`/api/v1/team/all?leagueId=${leagueId}`, {
        method: "GET",
        headers: await createHeaders(false),
      });

      if (typeof response !== "string" && response.statusCode === "FO-200") {
        const teamData = response.data;
        if (teamData && Array.isArray(teamData)) {
          setTeams(teamData);
        }
      }
    } catch (error) {
      console.error("팀 목록 불러오기 오류:", error);
      setTeams([]);
    }
  };

  // 프로필 이미지 처리
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };



  // 다음 우편번호 서비스 연동
  const handleAddressSearch = () => {
    // @ts-expect-error: 우편 번호 api를 제공하는 플랫폼이 무조건 다음으로 지정했기 때문에
    if (typeof daum !== "undefined" && daum.Postcode) {
      // @ts-expect-error: 우편 번호 api를 제공하는 플랫폼이 무조건 다음으로 지정했기 때문에
      new daum.Postcode({
        oncomplete: function (data: any) {
          // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
          // 각 주소의 노출 규칙에 따라 주소를 조합한다.
          let addr = ""; // 주소 변수

          //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
          if (data.userSelectedType === "R") {
            // 사용자가 도로명 주소를 선택했을 경우
            addr = data.roadAddress;
          } else {
            // 사용자가 지번 주소를 선택했을 경우(J)
            addr = data.jibunAddress;
          }

          // 선택된 주소를 input에 설정
          setEditForm({
            ...editForm,
            address: addr,
          });
        },
      }).open();
    } else {
      alert("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleEditToggle = async () => {
    if (!isEditing) {
      // 편집 모드로 전환할 때
      // 맨 위로 스크롤
      if (pageRef.current) {
        pageRef.current.scrollIntoView({ behavior: "smooth" });
      }

      // 리그 목록 호출
      await fetchLeagues();

      // 현재 정보로 폼 초기화
      if (userInfo) {
        setEditForm({
          nickName: userInfo.nickName || "",
          leagueId: userInfo.leagueId || 0,
          leagueName: userInfo.leagueName || "",
          teamId: userInfo.teamId || 0,
          teamName: userInfo.teamName || "",
          personalInfoAgreement: userInfo.personalInfoAgreement || "",
          marketingAgreement: userInfo.marketingAgreement || "",
          phone: userInfo.phone || "",
          birthDate: formatDateForInput(userInfo.birthDate),
          address: userInfo.address || "",
        });

        // 현재 리그의 팀 목록 호출
        if (userInfo.leagueId && userInfo.leagueId > 0) {
          await fetchTeams(userInfo.leagueId);
        }
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    try {
      // FormData로 파일과 JSON 데이터 함께 전송
      const formData = new FormData();

      // JSON 데이터 추가
      const jsonData = {
        nickName: editForm.nickName,
        address: editForm.address,
        birthDate: editForm.birthDate.replace(/-/g, ""), // YYYYMMDD 형식으로 변환
        phone: editForm.phone,
        leagueId: editForm.leagueId,
        leagueName: editForm.leagueName,
        teamId: editForm.teamId,
        teamName: editForm.teamName,
        personalInfoAgreement:
          editForm.personalInfoAgreement === "y" ? "y" : "n",
        marketingAgreement: editForm.marketingAgreement === "y" ? "y" : "n",
      };

      // 프로필 이미지 파일 추가 (있을 경우)
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      // JSON 데이터를 추가
      formData.append(
        "updateInfo",
        new Blob([JSON.stringify(jsonData)], { type: "application/json" })
      );

      const response = await execute("/api/v1/member/update", {
        method: "PUT",
        headers: await createHeaders(true), // apiRequest에서 FormData 감지하여 Content-Type 자동 제거
        body: formData,
      });

      if (typeof response !== "string" && response.statusCode === "FO-200") {
        const res = response;
        if (res.statusCode === "FO-200") {
          // 성공 시 마이페이지로 리다이렉트
          setIsEditing(false);
          router.push("/my-page");
          window.location.reload();
        } else {
          setErrorMessage("정보 수정에 실패했습니다.");
          setShowErrorDialog(true);
        }
      } else {
        setErrorMessage("정보 수정에 실패했습니다.");
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("API 호출 오류:", error);
      setErrorMessage("서버 연결에 실패했습니다.");
      setShowErrorDialog(true);
    }
  };

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
    <div ref={pageRef} className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* 페이지 헤더 */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <div className="flex items-center space-x-6 justify-evenly">
              <div className="relative">
                {isEditing ? (
                  <div className="relative">
                    <div className="flex w-40 h-40 rounded-full overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 items-center justify-center">
                      {profileImagePreview ? (
                        <img
                          src={profileImagePreview}
                          alt="프로필 미리보기"
                          className="w-40 h-40 object-cover"
                        />
                      ) : userInfo.profileImage ? (
                        <img
                          src={userInfo.profileImage}
                          alt="프로필"
                          className="w-40 h-40 object-cover"
                        />
                      ) : (
                        <DefaultProfile size="xl" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageChange}
                        className="hidden w-20 h-20"
                      />
                    </label>
                  </div>
                ) : (
                  <>
                    {userInfo.profileImage ? (
                      <img
                        src={userInfo.profileImage}
                        alt="프로필"
                        className="w-100 h-100 rounded-full object-cover"
                      />
                    ) : (
                      <DefaultProfile size="xl" />
                    )}
                  </>
                )}
                <h5 className="mt-4 text-center text-md font-bold font-semibold text-brand-primary">
                  {userInfo.nickName}
                  <span className="text-gray-500">님 환영합니다.</span>
                </h5>
              </div>
              <div className="h-full w-full">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  사전 등록을 완료하셨습니다.
                </h1>
                <h2 className="text-sm text-gray-600 mb-2">
                  *마케팅(이메일 수신 동의)시 필로의 행사 안내와 행사 참가비
                  할인이 제공됩니다.
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      가입일: {formatDateSafely(userInfo.joinDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              기본 정보
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름
                </label>
                {isEditing ? (
                  <TextInput
                    value={editForm.nickName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, nickName: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{userInfo.nickName}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <span className="text-gray-900">{userInfo.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호
                </label>
                {isEditing ? (
                  <TextInput
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    placeholder="전화번호를 입력해주세요"
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      {userInfo.phone || "등록되지 않음"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  생년월일
                </label>
                {isEditing ? (
                  <TextInput
                    type="date"
                    value={editForm.birthDate}
                    onChange={(e) =>
                      setEditForm({ ...editForm, birthDate: e.target.value })
                    }
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      {formatDateSafely(userInfo.birthDate)}
                    </span>
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  주소
                </label>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <TextInput
                      value={editForm.address}
                      onChange={(e) =>
                        setEditForm({ ...editForm, address: e.target.value })
                      }
                      placeholder="주소를 입력해주세요"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddressSearch}
                      className="px-4 py-2 whitespace-nowrap"
                    >
                      주소 검색
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">
                      {userInfo.address || "등록되지 않음"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 선호 리그 및 팀 정보 */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              선호 팀 정보
            </h2>

            {isEditing ? (
              <div className="space-y-8">
                {/* 편집 모드: 리그 선택 */}
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-gray-700">
                    선호 리그
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                    {[...leagues, { leagueId: 0, leagueName: "없음" }].map(
                      (league) => {
                        const getLeagueImage = (leagueName: string) => {
                          switch (leagueName) {
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
                            default:
                              return "/assets/images/freeagent.png";
                          }
                        };

                        return (
                          <label
                            key={league.leagueId}
                            className="flex flex-col items-center cursor-pointer group p-4"
                          >
                            <div className="relative mb-4">
                              <div className="mb-6 w-20 h-20 rounded-lg overflow-hidden bg-gray-50 mb-3 transition-all duration-200 group-hover:bg-purple-50 group-hover:shadow-lg">
                                <Image
                                  src={getLeagueImage(league.leagueName)}
                                  alt={league.leagueName}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-contain p-2"
                                />
                              </div>
                              <input
                                type="radio"
                                name="selectedLeague"
                                value={league.leagueId}
                                checked={editForm.leagueId === league.leagueId}
                                onChange={async (e) => {
                                  const leagueId = parseInt(e.target.value);
                                  setEditForm({
                                    ...editForm,
                                    leagueId: leagueId,
                                    leagueName: league.leagueName,
                                    teamId: 0,
                                    teamName: "",
                                  });
                                  await fetchTeams(leagueId);
                                }}
                                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-5 text-purple-600 focus:ring-purple-500"
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700 text-center group-hover:text-purple-600 transition-colors">
                              {league.leagueName}
                            </span>
                          </label>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* 편집 모드: 팀 선택 */}
                {teams.length > 0 && (
                  <div className="space-y-4">
                    <label className="block text-lg font-medium text-gray-700">
                      선호 팀
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                      {teams.map((team: Team) => {
                        const getTeamImage = (
                          teamName: string,
                          leagueId: number
                        ) => {
                          const teamImageMap: Record<
                            number,
                            Record<string, string>
                          > = {
                            1: {
                              아스날: "/assets/images/premier/arsenal.png",
                              첼시: "/assets/images/premier/chelsea.png",
                              "맨체스터 시티":
                                "/assets/images/premier/manchestercity.png",
                              "맨체스터 유나이티드":
                                "/assets/images/premier/manchesterunited.png",
                              리버풀: "/assets/images/premier/riverpool.png",
                              토트넘: "/assets/images/premier/tottenham.png",
                            },
                            2: {
                              바르셀로나: "/assets/images/laliga/barcelona.png",
                              "레알 마드리드":
                                "/assets/images/laliga/realmadrid.png",
                              "아틀레티코 마드리드":
                                "/assets/images/laliga/atleticomadrid.png",
                              세비야: "/assets/images/laliga/sevilla.png",
                              발렌시아: "/assets/images/laliga/valencia.png",
                              비야레알: "/assets/images/laliga/villareal.png",
                            },
                            3: {
                              "바이에른 뮌헨":
                                "/assets/images/bundesliga/bayernmunchen.png",
                              도르트문트:
                                "/assets/images/bundesliga/dortmund.png",
                              레버쿠젠:
                                "/assets/images/bundesliga/leverkusen.png",
                            },
                            4: {
                              인터밀란: "/assets/images/serie/intermilan.png",
                              AC밀란: "/assets/images/serie/acmilan.png",
                              유벤투스: "/assets/images/serie/juventus.png",
                              아탈란타: "/assets/images/serie/atalanta.png",
                              AS로마: "/assets/images/serie/asroma.png",
                            },
                            5: {
                              PSG: "/assets/images/league1/psg.png",
                              리옹: "/assets/images/league1/lyon.png",
                              마르세유: "/assets/images/league1/marseille.png",
                              AS모나코: "/assets/images/league1/asmonaco.png",
                              릴: "/assets/images/league1/lill.png",
                            },
                          };

                          if (teamName === "없음") {
                            return "/assets/images/freeagent.png";
                          }

                          return (
                            teamImageMap[leagueId]?.[teamName] ||
                            "/assets/images/freeagent.png"
                          );
                        };

                        return (
                          <label
                            key={team.teamId}
                            className="flex flex-col items-center cursor-pointer group p-3"
                          >
                            <div className="relative mb-3">
                              <div className="mb-6 w-16 h-16 rounded-lg overflow-hidden bg-gray-50 mb-2 transition-all duration-200 group-hover:bg-purple-50 group-hover:shadow-md">
                                <Image
                                  src={getTeamImage(
                                    team.teamName,
                                    editForm.leagueId
                                  )}
                                  alt={team.teamName}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-contain p-1"
                                />
                              </div>
                              <input
                                type="radio"
                                name="selectedTeam"
                                value={team.teamId}
                                checked={editForm.teamId === team.teamId}
                                onChange={(e) => {
                                  const teamId = parseInt(e.target.value);
                                  setEditForm({
                                    ...editForm,
                                    teamId: teamId,
                                    teamName: team.teamName,
                                  });
                                }}
                                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 text-purple-600 focus:ring-purple-500"
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-700 text-center group-hover:text-purple-600 transition-colors leading-tight px-1">
                              {team.teamName}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8 flex flex-row justify-evenly">
                {/* 보기 모드: 선호 리그 표시 */}
                <div className="space-y-4 items-center justify-center text-center w-full mr-4 ml-4">
                  <label className="block text-lg font-medium text-gray-700">
                    선호 리그
                  </label>
                  <div className="w-full flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-white shadow-md mb-3">
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
                              default:
                                return "/assets/images/freeagent.png";
                            }
                          })()}
                          alt={userInfo.leagueName}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <span className="text-lg font-semibold text-gray-900">
                        {userInfo.leagueName || "등록되지 않음"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 보기 모드: 선호 팀 표시 */}
                <div className="space-y-4 items-center justify-center text-center w-full mr-4 ml-4">
                  <label className="block text-lg font-medium text-gray-700">
                    선호 팀
                  </label>
                  <div className="w-full flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-white shadow-md mb-3">
                        <img
                          src={(() => {
                            const teamImageMap: Record<
                              number,
                              Record<string, string>
                            > = {
                              1: {
                                아스날: "/assets/images/premier/arsenal.png",
                                첼시: "/assets/images/premier/chelsea.png",
                                "맨체스터 시티":
                                  "/assets/images/premier/manchestercity.png",
                                "맨체스터 유나이티드":
                                  "/assets/images/premier/manchesterunited.png",
                                리버풀: "/assets/images/premier/riverpool.png",
                                토트넘: "/assets/images/premier/tottenham.png",
                              },
                              2: {
                                바르셀로나:
                                  "/assets/images/laliga/barcelona.png",
                                "레알 마드리드":
                                  "/assets/images/laliga/realmadrid.png",
                                "아틀레티코 마드리드":
                                  "/assets/images/laliga/atleticomadrid.png",
                                세비야: "/assets/images/laliga/sevilla.png",
                                발렌시아: "/assets/images/laliga/valencia.png",
                                비야레알: "/assets/images/laliga/villareal.png",
                              },
                              3: {
                                "바이에른 뮌헨":
                                  "/assets/images/bundesliga/bayernmunchen.png",
                                도르트문트:
                                  "/assets/images/bundesliga/dortmund.png",
                                레버쿠젠:
                                  "/assets/images/bundesliga/leverkusen.png",
                              },
                              4: {
                                인터밀란: "/assets/images/serie/intermilan.png",
                                AC밀란: "/assets/images/serie/acmilan.png",
                                유벤투스: "/assets/images/serie/juventus.png",
                                아탈란타: "/assets/images/serie/atalanta.png",
                                AS로마: "/assets/images/serie/asroma.png",
                              },
                              5: {
                                PSG: "/assets/images/league1/psg.png",
                                리옹: "/assets/images/league1/lyon.png",
                                마르세유:
                                  "/assets/images/league1/marseille.png",
                                AS모나코: "/assets/images/league1/asmonaco.png",
                                릴: "/assets/images/league1/lill.png",
                              },
                            };

                            if (userInfo.teamName === "없음") {
                              return "/assets/images/freeagent.png";
                            }

                            return (
                              teamImageMap[userInfo.leagueId]?.[
                                userInfo.teamName
                              ] || "/assets/images/freeagent.png"
                            );
                          })()}
                          alt={userInfo.teamName}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <span className="text-lg font-semibold text-gray-900">
                        {userInfo.teamName || "등록되지 않음"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 개인정보 이용 동의 및 마케팅 동의 */}
          <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              이용 동의 정보
            </h2>

            <div className="space-y-6">
              {/* 개인정보 이용 동의 */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        개인정보 이용 동의
                      </h3>
                      <p className="text-sm text-gray-500">
                        서비스 이용을 위한 필수 동의입니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">필수 동의</span>
                        <div className="relative inline-block">
                          <input
                            type="checkbox"
                            checked={true}
                            disabled={true}
                            className="sr-only"
                          />
                          <div className="w-12 h-6 bg-gray-300 rounded-full cursor-not-allowed">
                            <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-6 transition-transform duration-200 ease-in-out"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-green-600 font-medium">
                          {userInfo.personalInfoAgreement === "y"
                            ? "동의"
                            : "미동의"}
                        </span>
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 마케팅 이용 동의 */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        마케팅 이용 동의
                      </h3>
                      <p className="text-sm text-gray-500">
                        이벤트, 할인 정보 등 마케팅 메시지 수신에 대한
                        동의입니다.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">선택 동의</span>
                        <div className="relative inline-block">
                          <input
                            type="checkbox"
                            checked={editForm.marketingAgreement === "y"}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                marketingAgreement: e.target.checked
                                  ? "y"
                                  : "n",
                              })
                            }
                            className="sr-only"
                          />
                          <div
                            className={`w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                              editForm.marketingAgreement === "y"
                                ? "bg-purple-600"
                                : "bg-gray-300"
                            }`}
                            onClick={() =>
                              setEditForm({
                                ...editForm,
                                marketingAgreement:
                                  editForm.marketingAgreement === "y"
                                    ? "n"
                                    : "y",
                              })
                            }
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
                                editForm.marketingAgreement === "y"
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              }`}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-medium ${
                            userInfo.marketingAgreement === "y"
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {userInfo.marketingAgreement === "y"
                            ? "동의"
                            : "미동의"}
                        </span>
                        {userInfo.marketingAgreement === "y" ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 보안 설정 */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">설정</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <Key className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">비밀번호 변경</h3>
                    <p className="text-sm text-gray-500">
                      계정 보안을 위해 정기적으로 비밀번호를 변경하세요
                    </p>
                  </div>
                </div>
                <Button
                  className="w-35 bg-brand-primary text-white font-bold hover:bg-brand-primary-dark"
                  variant="outline"
                  onClick={handlePasswordReset}
                >
                  비밀번호 찾기
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <Edit className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <h3 className="font-medium text-gray-900">개인정보 수정</h3>
                    <p className="text-sm text-gray-500">
                      이름, 전화번호, 주소 등 개인정보를 수정할 수 있습니다
                    </p>
                  </div>
                </div>
                <Button
                  className="w-35 bg-brand-primary text-white font-bold hover:bg-brand-primary-dark"
                  variant="outline"
                  onClick={handleEditToggle}
                >
                  {isEditing ? "취소" : "정보 수정"}
                </Button>
              </div>

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
                <Button
                  variant="outline"
                  onClick={handleKakaoInquiry}
                  className="w-35 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 border-yellow-400 hover:border-yellow-500 font-bold"
                >
                  카카오 문의
                </Button>
              </div>
            </div>
          </div>

          {/* 편집 모드일 때 취소/저장하기 버튼 */}
          {isEditing && (
            <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  onClick={handleEditToggle}
                  className="px-8 py-3"
                >
                  취소
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  저장하기
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 에러 다이얼로그 */}
      {showErrorDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">주의</h3>
              <p className="text-gray-600 mb-6 whitespace-pre-line">
                {errorMessage}
              </p>
              <button
                onClick={() => {
                  setShowErrorDialog(false);
                  setErrorMessage("");
                }}
                className="w-full py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
