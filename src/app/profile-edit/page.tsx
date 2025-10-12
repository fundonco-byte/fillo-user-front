"use client";

import { useEffect, useState, useRef } from "react";
import { Eye, EyeOff, ChevronDown, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import { createHeaders } from "@/lib/api";
import { League, Team } from "@/types/league";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DefaultProfile } from "@/components/ui";

interface FormData {
  email: string;
  name: string;
  passwordChangeCheck: string;
  password: string;
  newPassword: string;
  newPasswordConfirm: string;
  gender: string;
  birthDate: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  leagueId: number;
  leagueName: string;
  teamId: number;
  teamName: string;
  leagueId2: number;
  league2Name: string;
  teamId2: number;
  team2Name: string;
  personalInfoAgreement: string;
  marketingAgreement: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  password?: string;
  passwordConfirm?: string;
  gender?: string;
  birth?: string;
  selectedLeague?: string;
  selectedTeam?: string;
  agreeTerms?: string;
}

interface UserInfo {
  id: string;
  email: string;
  name: string;
  nickName: string;
  phone?: string;
  profileImage?: string;
  gender?: string;
  birthDate?: string;
  address?: string;
  joinDate: string;
  preferredSports: string[];
  leagueId: number;
  leagueName: string;
  teamId: number;
  teamName: string;
  leagueId2: number;
  teamId2: number;
  league2Name: string;
  team2Name: string;
  personalInfoAgreement: string;
  marketingAgreement: string;
}

// 리그 이미지 매핑
const getLeagueImage = (leagueId: number): string => {
  const imageMap: Record<number, string> = {
    1: "/assets/images/league/premierleague.png",
    2: "/assets/images/league/laliga.png",
    3: "/assets/images/league/bundesliga.png",
    4: "/assets/images/league/seriea.png",
    5: "/assets/images/league/league1.png",
    6: "/assets/images/league/national_team.png",
    7: "/assets/images/league/kleague.png",
    8: "/assets/images/league/world.png",
    0: "/assets/images/freeagent.png",
  };
  return imageMap[leagueId] || "/assets/images/league/world.png";
};

export default function ProfileEditPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { execute: apiRequest } = useApi();
  const pageRef = useRef<HTMLDivElement>(null);

  // 폼 데이터 상태
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    passwordChangeCheck: "N",
    password: "",
    newPassword: "",
    newPasswordConfirm: "",
    gender: "",
    birthDate: "",
    birthYear: new Date().getFullYear(),
    birthMonth: 1,
    birthDay: 1,
    leagueId: 0,
    leagueName: "",
    teamId: 0,
    teamName: "",
    leagueId2: 0,
    league2Name: "없음",
    teamId2: 0,
    team2Name: "",
    personalInfoAgreement: "n",
    marketingAgreement: "n",
  });

  // 에러 상태
  const [errors, setErrors] = useState<FormErrors>({});

  // UI 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 리그/팀 선택 상태
  const [selectedLeagues, setSelectedLeagues] = useState<number[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<
    { leagueId: number; teamId: number }[]
  >([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teamsMap, setTeamsMap] = useState<Record<number, Team[]>>({});

  // 프로필 이미지 상태
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");

  // 사용자 정보 상태
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    if (!session?.user?.email) return;

    try {
      const response = await apiRequest("/api/v1/member/info", {
        method: "GET",
      });

      if (response && typeof response !== "string" && response.data) {
        const data = response.data as UserInfo;
        setUserInfo(data);

        // 생년월일 파싱 (YYYY-MM-DD 또는 YYYYMMDD 형식)
        let birthYear = new Date().getFullYear();
        let birthMonth = 1;
        let birthDay = 1;

        if (data.birthDate) {
          const dateStr = data.birthDate.replace(/-/g, ""); // YYYY-MM-DD -> YYYYMMDD
          if (dateStr.length === 8) {
            birthYear = parseInt(dateStr.substring(0, 4));
            birthMonth = parseInt(dateStr.substring(4, 6));
            birthDay = parseInt(dateStr.substring(6, 8));
          }
        }

        // 폼 데이터에 사용자 정보 설정
        setFormData({
          email: data.email || "",
          name: data.name || "",
          passwordChangeCheck: "N",
          password: "",
          newPassword: "",
          newPasswordConfirm: "",
          gender: data.gender || "",
          birthDate: data.birthDate || "",
          birthYear,
          birthMonth,
          birthDay,
          leagueId: data.leagueId || 0,
          leagueName: data.leagueName || "",
          teamId: data.teamId || 0,
          teamName: data.teamName || "",
          leagueId2: data.leagueId2 || 0,
          league2Name: data.league2Name || "없음",
          teamId2: data.teamId2 || 0,
          team2Name: data.team2Name || "",
          personalInfoAgreement: data.personalInfoAgreement || "n",
          marketingAgreement: data.marketingAgreement || "n",
        });

        // 기존 프로필 이미지 설정
        if (data.profileImage) {
          setProfileImagePreview(data.profileImage);
        }

        // 기존 리그/팀 선택 설정
        const leagueIds: number[] = [];
        const teams: { leagueId: number; teamId: number }[] = [];

        if (data.leagueId && data.teamId) {
          leagueIds.push(data.leagueId);
          teams.push({ leagueId: data.leagueId, teamId: data.teamId });
          // 첫 번째 리그의 팀 정보 로드
          await fetchTeamsForLeague(data.leagueId);
        }
        if (data.leagueId2 && data.teamId2) {
          leagueIds.push(data.leagueId2);
          teams.push({ leagueId: data.leagueId2, teamId: data.teamId2 });
          // 두 번째 리그의 팀 정보 로드
          await fetchTeamsForLeague(data.leagueId2);
        }

        setSelectedLeagues(leagueIds);
        setSelectedTeams(teams);
      }
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error);
    }
  };

  // 리그 데이터 가져오기
  const fetchLeagues = async () => {
    try {
      const response = await apiRequest("/api/v1/league/all", {
        method: "GET",
      });

      if (response && typeof response !== "string" && response.data) {
        const data = response.data as League[];
        setLeagues(data);
      }
    } catch (error) {
      console.error("리그 데이터 가져오기 오류:", error);
    }
  };

  // 특정 리그의 팀 데이터 가져오기
  const fetchTeamsForLeague = async (leagueId: number) => {
    if (leagueId === 0) return;

    // 이미 로드된 팀 데이터가 있으면 재사용
    if (teamsMap[leagueId]) {
      return teamsMap[leagueId];
    }

    try {
      const response = await apiRequest(
        `/api/v1/team/all?leagueId=${leagueId}`,
        {
          method: "GET",
        }
      );

      if (response && typeof response !== "string" && response.data) {
        const teamData = response.data as Team[];

        if (Array.isArray(teamData) && teamData.length > 0) {
          setTeamsMap((prev) => ({
            ...prev,
            [leagueId]: teamData,
          }));
          return teamData;
        }
      }
      return [];
    } catch (error) {
      console.error("팀 데이터 가져오기 오류:", error);
      return [];
    }
  };

  // 프로필 이미지 변경 핸들러
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 입력 변경 핸들러
  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 에러 메시지 제거
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // 리그 선택 핸들러
  const handleLeagueSelection = async (leagueId: number) => {
    if (leagueId === 0) {
      // "없음" 선택 시 모든 선택 해제
      setSelectedLeagues([]);
      setSelectedTeams([]);
      setFormData((prev) => ({
        ...prev,
        leagueId: 0,
        teamId: 0,
        leagueId2: 0,
        teamId2: 0,
      }));
      return;
    }

    setSelectedLeagues((prev) => {
      const isSelected = prev.includes(leagueId);
      if (isSelected) {
        // 이미 선택된 리그인 경우 선택 해제
        const newSelectedLeagues = prev.filter((id) => id !== leagueId);
        const newSelectedTeams = selectedTeams.filter(
          (team) => team.leagueId !== leagueId
        );
        setSelectedTeams(newSelectedTeams);
        updateFormDataFromSelections(newSelectedLeagues, newSelectedTeams);
        return newSelectedLeagues;
      } else {
        // 새로운 리그 선택
        const newSelectedLeagues = [...prev, leagueId];

        // 해당 리그의 팀 데이터 로드
        fetchTeamsForLeague(leagueId);

        setSelectedTeams((prevTeams) => {
          const newSelectedTeams = prevTeams.filter(
            (team) => team.leagueId !== leagueId
          );
          updateFormDataFromSelections(newSelectedLeagues, newSelectedTeams);
          return newSelectedTeams;
        });
        return newSelectedLeagues;
      }
    });
  };

  // 팀 선택 핸들러
  const handleTeamSelection = (leagueId: number, teamId: number) => {
    setSelectedTeams((prev) => {
      const existingTeamIndex = prev.findIndex(
        (team) => team.leagueId === leagueId && team.teamId === teamId
      );

      if (existingTeamIndex !== -1) {
        // 이미 선택된 팀인 경우 선택 해제
        const newSelectedTeams = prev.filter(
          (_, index) => index !== existingTeamIndex
        );
        updateFormDataFromSelections(selectedLeagues, newSelectedTeams);
        return newSelectedTeams;
      } else {
        // 새로운 팀 선택 (최대 2개)
        if (prev.length >= 2) {
          return prev;
        }
        const newSelectedTeams = [...prev, { leagueId, teamId }];
        updateFormDataFromSelections(selectedLeagues, newSelectedTeams);
        return newSelectedTeams;
      }
    });
  };

  // 선택된 리그/팀으로 폼 데이터 업데이트
  const updateFormDataFromSelections = (
    selectedLeagueIds: number[],
    teams: { leagueId: number; teamId: number }[]
  ) => {
    const firstTeam = teams[0];
    const secondTeam = teams[1];

    // 리그 이름 찾기
    const getLeagueName = (leagueId: number) => {
      const league = leagues.find((l) => l.leagueId === leagueId);
      return league?.leagueName || "";
    };

    // 팀 이름 찾기
    const getTeamName = (leagueId: number, teamId: number) => {
      const teamsForLeague = teamsMap[leagueId] || [];
      const team = teamsForLeague.find((t) => t.teamId === teamId);
      return team?.teamName || "";
    };

    setFormData((prev) => ({
      ...prev,
      leagueId: firstTeam?.leagueId || 0,
      leagueName: firstTeam ? getLeagueName(firstTeam.leagueId) : "",
      teamId: firstTeam?.teamId || 0,
      teamName: firstTeam
        ? getTeamName(firstTeam.leagueId, firstTeam.teamId)
        : "",
      leagueId2: secondTeam?.leagueId || 0,
      league2Name: secondTeam ? getLeagueName(secondTeam.leagueId) : "없음",
      teamId2: secondTeam?.teamId || 0,
      team2Name: secondTeam
        ? getTeamName(secondTeam.leagueId, secondTeam.teamId)
        : "",
    }));
  };

  // 폼 검증
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    }

    // 비밀번호 변경이 체크된 경우에만 비밀번호 검증
    if (formData.passwordChangeCheck === "Y") {
      if (!formData.password.trim()) {
        newErrors.password = "현재 비밀번호를 입력해주세요.";
      }

      if (!formData.newPassword.trim()) {
        newErrors.passwordConfirm = "새 비밀번호를 입력해주세요.";
      } else if (formData.newPassword.length < 8) {
        newErrors.passwordConfirm = "비밀번호는 8자 이상이어야 합니다.";
      } else if (formData.newPassword !== formData.newPasswordConfirm) {
        newErrors.passwordConfirm = "새 비밀번호가 일치하지 않습니다.";
      }
    }

    if (
      !formData.birthDate ||
      formData.birthYear === 0 ||
      formData.birthMonth === 0 ||
      formData.birthDay === 0
    ) {
      newErrors.birth = "생년월일을 선택해주세요.";
    }

    if (selectedLeagues.length === 0) {
      newErrors.selectedLeague = "최소 1개의 리그를 선택해주세요.";
    }

    if (selectedTeams.length === 0) {
      newErrors.selectedTeam = "최소 1개의 팀을 선택해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // 기본 정보 검증
      if (!formData.name?.trim()) {
        throw new Error("이름이 입력되지 않았습니다.");
      }

      // 비밀번호 변경이 체크된 경우 비밀번호 검증
      if (formData.passwordChangeCheck === "Y") {
        if (!formData.password?.trim() || !formData.newPassword?.trim()) {
          throw new Error(
            "비밀번호 변경 시 현재 비밀번호와 새 비밀번호를 모두 입력해야 합니다."
          );
        }
        if (formData.newPassword !== formData.newPasswordConfirm) {
          throw new Error("새 비밀번호가 일치하지 않습니다.");
        }
      }

      // 생년월일 검증
      if (!formData.birthDate || formData.birthDate.length !== 8) {
        throw new Error("올바른 생년월일을 선택해주세요.");
      }

      // 리그/팀 정보 검증
      if (formData.leagueId === 0 || formData.teamId === 0) {
        throw new Error("최소 1개의 리그와 팀을 선택해야 합니다.");
      }

      // 요청 데이터 구성 (서버 형식에 맞게)
      const requestData: Record<string, string | number> = {
        name: formData.name.trim(),
        passwordChangeCheck: formData.passwordChangeCheck,
        birthDate: formData.birthDate,
        leagueId: formData.leagueId,
        leagueName: formData.leagueName || "",
        teamId: formData.teamId,
        teamName: formData.teamName || "",
        leagueId2: formData.leagueId2,
        league2Name: formData.league2Name || "없음",
        teamId2: formData.teamId2,
        team2Name: formData.team2Name || "",
        marketingAgreement: formData.marketingAgreement,
      };

      // 데이터 검증 로그
      console.log("=== 데이터 검증 (서버 형식) ===");
      console.log(
        "name:",
        requestData.name,
        "(length:",
        requestData.name.length,
        ")"
      );
      console.log("passwordChangeCheck:", requestData.passwordChangeCheck);
      console.log(
        "birthDate:",
        requestData.birthDate,
        "(length:",
        requestData.birthDate.length,
        ")"
      );
      console.log(
        "leagueId:",
        requestData.leagueId,
        "(type:",
        typeof requestData.leagueId,
        ")"
      );
      console.log("leagueName:", requestData.leagueName);
      console.log(
        "teamId:",
        requestData.teamId,
        "(type:",
        typeof requestData.teamId,
        ")"
      );
      console.log("teamName:", requestData.teamName);
      console.log(
        "leagueId2:",
        requestData.leagueId2,
        "(type:",
        typeof requestData.leagueId2,
        ")"
      );
      console.log("league2Name:", requestData.league2Name);
      console.log(
        "teamId2:",
        requestData.teamId2,
        "(type:",
        typeof requestData.teamId2,
        ")"
      );
      console.log("team2Name:", requestData.team2Name);
      console.log("marketingAgreement:", requestData.marketingAgreement);

      // 비밀번호 변경이 체크된 경우에만 비밀번호 필드 추가
      if (formData.passwordChangeCheck === "Y") {
        requestData.password = formData.password.trim();
        requestData.newPassword = formData.newPassword.trim();
        console.log(
          "비밀번호 필드 추가됨 - password length:",
          requestData.password.length,
          "newPassword length:",
          requestData.newPassword.length
        );
      } else {
        console.log("비밀번호 변경 안함 - 비밀번호 필드 제외");
      }

      // 디버깅: 전송되는 데이터 로그
      console.log("=== 회원정보 수정 API 요청 데이터 ===");
      console.log("Request Data:", requestData);
      console.log("FormData 객체:", formData);
      console.log("선택된 리그:", selectedLeagues);
      console.log("선택된 팀:", selectedTeams);

      // 항상 FormData 사용 (서버가 multipart/form-data를 기대함)
      const formDataToSend = new FormData();

      // JSON 데이터를 'updateInfo' part로 추가 (서버에서 요구하는 part 이름)
      const updateInfoBlob = new Blob([JSON.stringify(requestData)], {
        type: "application/json",
      });
      formDataToSend.append("updateInfo", updateInfoBlob);

      // 프로필 이미지가 있는 경우 추가
      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
        console.log("프로필 이미지 포함하여 전송");
      } else {
        console.log("프로필 이미지 없이 전송");
      }

      // FormData 내용 로깅
      console.log("=== FormData 내용 ===");
      for (const [key, value] of formDataToSend.entries()) {
        if (value instanceof Blob) {
          console.log(`${key}:`, "Blob -", value.type, value.size + " bytes");
        } else {
          console.log(`${key}:`, value);
        }
      }

      const response = await apiRequest("/api/v1/member/update", {
        method: "PUT",
        body: formDataToSend,
      });

      console.log("=== API 응답 ===");
      console.log("Response:", response);
      console.log("Response type:", typeof response);
      if (typeof response !== "string") {
        console.log("Status Code:", response?.statusCode);
        console.log("Status Message:", response?.statusMessage);
        console.log("Response Data:", response?.data);
      }

      if (
        response &&
        typeof response !== "string" &&
        response.statusCode === "FO-200"
      ) {
        // 성공 시 마이페이지로 리다이렉트
        router.push("/my-page");
      } else {
        const errorMessage: string =
          (typeof response !== "string" &&
          typeof response?.statusMessage === "string"
            ? response.statusMessage
            : "") ||
          (typeof response !== "string" && typeof response?.data === "string"
            ? response.data
            : "") ||
          "회원정보 수정 중 오류가 발생했습니다.";

        console.log("=== 에러 정보 ===");
        console.log("Error Message:", errorMessage);
        console.log(
          "Full Response:",
          JSON.stringify(response || "no response", null, 2)
        );

        setErrorMessage(errorMessage);
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("회원정보 수정 API 오류:", error);

      let errorMessage = "회원정보 수정 중 오류가 발생했습니다.";

      if (error instanceof Error) {
        if (error.message.includes("HTTP error! status: 400")) {
          errorMessage =
            "입력된 정보에 문제가 있습니다. 모든 필드를 올바르게 입력했는지 확인해주세요.";
        } else if (error.message.includes("HTTP error! status: 401")) {
          errorMessage = "인증이 만료되었습니다. 다시 로그인해주세요.";
        } else if (error.message.includes("HTTP error! status: 500")) {
          errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        } else if (error.message.includes("서버에 연결할 수 없습니다")) {
          errorMessage =
            "서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.";
        } else {
          errorMessage = error.message;
        }
      }

      setErrorMessage(errorMessage);
      setShowErrorDialog(true);
    }
  };

  // 생년월일 업데이트 (YYYYMMDD 형식)
  useEffect(() => {
    if (formData.birthYear && formData.birthMonth && formData.birthDay) {
      const year = formData.birthYear;
      const month = formData.birthMonth.toString().padStart(2, "0");
      const day = formData.birthDay.toString().padStart(2, "0");
      const birthDate = `${year}${month}${day}`;
      setFormData((prev) => ({
        ...prev,
        birthDate,
      }));
    }
  }, [formData.birthYear, formData.birthMonth, formData.birthDay]);

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    fetchUserInfo();
    fetchLeagues();
  }, [session]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 mt-16 sm:mt-20 mb-16 sm:mb-20">
      <div className="w-full max-w-[600px] space-y-6 sm:space-y-10">
        {/* 헤더 섹션 */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4 gap-2">
            <Image
              src={"/assets/images/fillo_brand_text.png"}
              alt="Fillo Logo"
              width={115}
              height={58}
              className="object-contain w-20 sm:w-24 lg:w-[115px]"
            />
            <h1
              className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-[#1a1a1a] leading-tight sm:leading-[62px]"
              style={{ fontFamily: "SUIT" }}
            >
              {" 정보 수정 "}
            </h1>
          </div>

          <p
            className="text-sm sm:text-base lg:text-[18px] font-semibold text-[#1a1a1a] leading-relaxed sm:leading-[29px]"
            style={{ fontFamily: "SUIT" }}
          >
            개인 정보를 수정할 수 있습니다.
          </p>
        </div>

        {/* 회원정보 수정 폼 */}
        <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
          {/* 프로필 이미지 섹션 - 회원가입 페이지에는 없지만 추가 */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3
                className="text-base sm:text-lg lg:text-[20px] font-semibold text-[#1a1a1a] mb-3 sm:mb-4"
                style={{ fontFamily: "SUIT" }}
              >
                프로필 이미지
              </h3>
              <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
                <div className="relative">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="프로필 미리보기"
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                    />
                  ) : (
                    <DefaultProfile size="2xl" />
                  )}
                </div>
                <div className="flex-1 w-full sm:w-auto">
                  <label className="cursor-pointer">
                    <div className="flex items-center justify-center sm:justify-start space-x-2 px-4 py-2.5 sm:py-2 border border-[#9400ea] rounded-lg bg-white text-[#9400ea] hover:bg-[#f3e6fc] transition-colors">
                      <Upload className="w-4 h-4" />
                      <span
                        className="text-sm sm:text-[14px] font-medium"
                        style={{ fontFamily: "SUIT" }}
                      >
                        이미지 업로드
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </label>
                  <p
                    className="text-xs sm:text-[12px] text-[#666666] mt-2 text-center sm:text-left"
                    style={{ fontFamily: "SUIT" }}
                  >
                    JPG, PNG 파일만 업로드 가능합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 구분선 */}
          <div className="border-t border-[#f3e6fc]"></div>

          {/* 이메일 인증 섹션 */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3
                className="text-base sm:text-lg lg:text-[20px] font-semibold text-[#1a1a1a] mb-2"
                style={{ fontFamily: "SUIT" }}
              >
                아이디
              </h3>
              <p
                className="text-xs sm:text-[12px] text-[#1a1a1a] mb-1"
                style={{ fontFamily: "SUIT" }}
              >
                이메일은 변경하실 수 없습니다.
              </p>

              <div className="flex space-x-2">
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  placeholder="이메일 주소를 입력하세요."
                  className="flex-1 h-11 sm:h-[48px] px-3 sm:px-4 border border-[#dddddd] rounded-lg bg-[#f5f5f5] text-sm sm:text-base lg:text-[18px] placeholder-[#999999] cursor-not-allowed"
                  style={{ fontFamily: "SUIT" }}
                />
              </div>
            </div>
          </div>

          {/* 비밀번호 섹션 */}
          <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
            <div>
              <h3
                className="text-base sm:text-lg lg:text-[20px] font-semibold text-[#1a1a1a] mb-2"
                style={{ fontFamily: "SUIT" }}
              >
                비밀번호 변경
              </h3>
              <p
                className="text-xs sm:text-[12px] text-[#1a1a1a] mb-3 sm:mb-4"
                style={{ fontFamily: "SUIT" }}
              >
                영문, 숫자, 특수문자 포함 8~20자까지 입력하세요.
              </p>

              {/* 비밀번호 변경 체크박스 */}
              <div className="relative flex flex-row items-center justify-between mb-4 sm:mb-6">
                <span
                  className="text-sm sm:text-base lg:text-[16px] text-[#000000]"
                  style={{ fontFamily: "SUIT" }}
                >
                  비밀번호를 변경하시겠습니까?
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.passwordChangeCheck === "Y"}
                    onChange={(e) =>
                      handleInputChange(
                        "passwordChangeCheck",
                        e.target.checked ? "Y" : "N"
                      )
                    }
                    className="w-5 h-5 border-2 border-[#dddddd] rounded-sm focus:ring-2 focus:ring-[#9400ea] appearance-none bg-white checked:bg-[#9400ea] checked:border-[#9400ea]"
                  />
                  {formData.passwordChangeCheck === "Y" && (
                    <svg
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-6 sm:mb-8">
                <h4
                  className="text-sm sm:text-[15px] font-semibold text-[#1a1a1a] mb-2"
                  style={{ fontFamily: "SUIT" }}
                >
                  현재 비밀번호를 입력하세요.
                </h4>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="비밀번호를 입력하세요."
                    disabled={formData.passwordChangeCheck === "N"}
                    className={`w-full h-11 sm:h-[48px] px-3 sm:px-4 pr-10 sm:pr-12 border rounded-lg text-sm sm:text-base lg:text-[18px] placeholder-[#999999] ${
                      formData.passwordChangeCheck === "N"
                        ? "border-[#dddddd] bg-[#f5f5f5] cursor-not-allowed"
                        : "border-[#9400ea] bg-white focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
                    }`}
                    style={{ fontFamily: "SUIT" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    tabIndex={0}
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <h4
                  className="text-sm sm:text-[15px] font-semibold text-[#1a1a1a] mb-2"
                  style={{ fontFamily: "SUIT" }}
                >
                  변경할 비밀번호를 입력하세요.
                </h4>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleInputChange("newPassword", e.target.value)
                    }
                    placeholder="새 비밀번호를 입력하세요."
                    disabled={formData.passwordChangeCheck === "N"}
                    className={`w-full h-11 sm:h-[48px] px-3 sm:px-4 pr-10 sm:pr-12 border rounded-lg text-sm sm:text-base lg:text-[18px] placeholder-[#999999] ${
                      formData.passwordChangeCheck === "N"
                        ? "border-[#dddddd] bg-[#f5f5f5] cursor-not-allowed"
                        : "border-[#9400ea] bg-white focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
                    }`}
                    style={{ fontFamily: "SUIT" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={formData.passwordChangeCheck === "N"}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    tabIndex={0}
                    aria-label={
                      showPassword ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    value={formData.newPasswordConfirm}
                    onChange={(e) =>
                      handleInputChange("newPasswordConfirm", e.target.value)
                    }
                    placeholder="새 비밀번호를 다시 입력하세요."
                    disabled={formData.passwordChangeCheck === "N"}
                    className={`w-full h-11 sm:h-[48px] px-3 sm:px-4 pr-10 sm:pr-12 border rounded-lg text-sm sm:text-base lg:text-[18px] placeholder-[#999999] ${
                      formData.passwordChangeCheck === "N"
                        ? "border-[#dddddd] bg-[#f5f5f5] cursor-not-allowed"
                        : formData.newPassword &&
                          formData.newPasswordConfirm &&
                          formData.newPassword !== formData.newPasswordConfirm
                        ? "border-red-500 bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        : "border-[#9400ea] bg-white focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
                    }`}
                    style={{ fontFamily: "SUIT" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    disabled={formData.passwordChangeCheck === "N"}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    tabIndex={0}
                    aria-label={
                      showPasswordConfirm ? "비밀번호 숨기기" : "비밀번호 보기"
                    }
                  >
                    {showPasswordConfirm ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                {/* 비밀번호 불일치 경고 메시지 */}
                {formData.passwordChangeCheck === "Y" &&
                  formData.newPassword &&
                  formData.newPasswordConfirm &&
                  formData.newPassword !== formData.newPasswordConfirm && (
                    <p
                      className="text-[#e82239] text-[12px] mt-2"
                      style={{ fontFamily: "SUIT" }}
                    >
                      비밀번호가 일치하지 않습니다.
                    </p>
                  )}
              </div>

              {errors.password && (
                <p
                  className="text-[#e82239] text-[12px] mt-2"
                  style={{ fontFamily: "SUIT" }}
                >
                  {errors.password}
                </p>
              )}
              {errors.passwordConfirm && (
                <p
                  className="text-[#e82239] text-[12px] mt-2 text-right"
                  style={{ fontFamily: "SUIT" }}
                >
                  {errors.passwordConfirm}
                </p>
              )}
            </div>
          </div>

          {/* 약관 동의 섹션 */}
          <div className="space-y-3 sm:space-y-4">
            <div className="border border-[#9400ea] rounded-lg p-4 sm:p-5 bg-white">
              <div className="h-[300px] sm:h-[400px] lg:h-[480px] overflow-y-auto">
                <div className="space-y-3 sm:space-y-4">
                  <h4
                    className="text-sm sm:text-base lg:text-[16px] font-semibold text-[#1a1a1a]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    제1조 (목적)
                  </h4>
                  <p
                    className="text-xs sm:text-sm lg:text-[14px] text-[#1a1a1a] leading-relaxed sm:leading-[20px]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    본 약관은 Fillo 서비스(이하 &quot;서비스&quot;)의 이용과
                    관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을
                    규정함을 목적으로 합니다.
                  </p>

                  <h4
                    className="text-sm sm:text-base lg:text-[16px] font-semibold text-[#1a1a1a]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    제2조 (정의)
                  </h4>
                  <p
                    className="text-xs sm:text-sm lg:text-[14px] text-[#1a1a1a] leading-relaxed sm:leading-[20px]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    1. &quot;서비스&quot;란 회사가 제공하는 축구 팬 커뮤니티 및
                    관련 서비스를 의미합니다.
                    <br />
                    2. &quot;이용자&quot;란 서비스에 접속하여 본 약관에 따라
                    서비스를 이용하는 회원을 의미합니다.
                    <br />
                    3. &quot;회원&quot;이란 서비스에 개인정보를 제공하여
                    회원등록을 한 자로서, 서비스의 정보를 지속적으로 제공받으며
                    서비스를 계속적으로 이용할 수 있는 자를 의미합니다.
                  </p>

                  <h4
                    className="text-sm sm:text-base lg:text-[16px] font-semibold text-[#1a1a1a]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    제3조 (개인정보 수집 및 이용)
                  </h4>
                  <p
                    className="text-xs sm:text-sm lg:text-[14px] text-[#1a1a1a] leading-relaxed sm:leading-[20px]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    회사는 서비스 제공을 위해 다음과 같은 개인정보를 수집 및
                    이용합니다:
                    <br />
                    • 수집항목: 이메일, 비밀번호, 이름, 성별, 생년월일, 응원팀
                    정보
                    <br />
                    • 수집목적: 회원가입 및 서비스 제공, 고객상담
                    <br />• 보유기간: 회원탈퇴 시까지 (단, 관련 법령에 의해
                    보존이 필요한 경우 해당 기간까지)
                  </p>

                  <h4
                    className="text-sm sm:text-base lg:text-[16px] font-semibold text-[#1a1a1a]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    제4조 (마케팅 정보 수신 동의)
                  </h4>
                  <p
                    className="text-xs sm:text-sm lg:text-[14px] text-[#1a1a1a] leading-relaxed sm:leading-[20px]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    회사는 이용자의 동의 하에 이메일 및 카카오톡을 통해 마케팅
                    정보를 제공할 수 있습니다. 동의하지 않아도 서비스 이용이
                    가능하며, 동의 후에도 언제든지 철회할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="relative flex flex-row items-center justify-between">
                <span
                  className="text-sm sm:text-base lg:text-[16px] text-[#000000]"
                  style={{ fontFamily: "SUIT" }}
                >
                  <span className="text-[#9400ea] font-bold">[필수]</span>{" "}
                  개인정보 수집 및 이용 동의
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={true}
                    disabled={true}
                    className="w-5 h-5 border-2 border-[#dddddd] rounded-sm appearance-none bg-[#9400ea] cursor-not-allowed"
                  />
                  <svg
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative flex flex-row items-center justify-between gap-2">
                <div>
                  <span
                    className="text-sm sm:text-base lg:text-[16px] text-[#000000]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    <span className="font-bold">[선택]</span> 마케팅(이메일) 및
                    카카오톡 알림 메시지를 수신에 동의합니다.
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.marketingAgreement === "y"}
                    onChange={(e) =>
                      handleInputChange(
                        "marketingAgreement",
                        e.target.checked ? "y" : "n"
                      )
                    }
                    className="w-5 h-5 border-2 border-[#dddddd] rounded-sm focus:ring-2 focus:ring-[#9400ea] appearance-none bg-white checked:bg-[#9400ea] checked:border-[#9400ea]"
                  />
                  {formData.marketingAgreement === "y" && (
                    <svg
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {errors.agreeTerms && (
              <p
                className="text-[#e82239] text-[12px]"
                style={{ fontFamily: "SUIT" }}
              >
                {errors.agreeTerms}
              </p>
            )}
          </div>

          {/* 구분선 */}
          <div className="border-t border-[#f3e6fc]"></div>

          {/* 이름 입력 */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3
                className="text-base sm:text-lg lg:text-[20px] font-semibold text-[#1a1a1a] mb-3 sm:mb-4"
                style={{ fontFamily: "SUIT" }}
              >
                이름
              </h3>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="이름 입력"
                className="w-full h-11 sm:h-[48px] px-3 sm:px-4 border border-[#9400ea] rounded-lg bg-white text-sm sm:text-base lg:text-[18px] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
                style={{ fontFamily: "SUIT" }}
              />
              {errors.name && (
                <p
                  className="text-[#e82239] text-[12px] mt-2"
                  style={{ fontFamily: "SUIT" }}
                >
                  {errors.name}
                </p>
              )}
            </div>
          </div>

          {/* 성별 선택 */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3
                className="text-base sm:text-lg lg:text-[20px] font-semibold text-[#1a1a1a] mb-3 sm:mb-4"
                style={{ fontFamily: "SUIT" }}
              >
                성별
              </h3>
              <p
                className="text-xs sm:text-[12px] text-[#666666] mb-3 sm:mb-4"
                style={{ fontFamily: "SUIT" }}
              >
                성별은 변경하실 수 없습니다.
              </p>
              <div className="flex space-x-4 sm:space-x-6">
                <label className="flex items-center space-x-2 cursor-not-allowed opacity-50">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.gender === "M"}
                      disabled={true}
                      className="w-5 h-5 border-2 border-[#dddddd] rounded-sm appearance-none bg-gray-100 checked:bg-[#9400ea] checked:border-[#9400ea] cursor-not-allowed"
                    />
                    {formData.gender === "M" && (
                      <svg
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-sm sm:text-base lg:text-[18px] text-[#1a1a1a]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    남성
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-not-allowed opacity-50">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.gender === "F"}
                      disabled={true}
                      className="w-5 h-5 border-2 border-[#dddddd] rounded-sm appearance-none bg-gray-100 checked:bg-[#9400ea] checked:border-[#9400ea] cursor-not-allowed"
                    />
                    {formData.gender === "F" && (
                      <svg
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-sm sm:text-base lg:text-[18px] text-[#1a1a1a]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    여성
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 생년월일 */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3
                className="text-base sm:text-lg lg:text-[20px] font-semibold text-[#1a1a1a] mb-3 sm:mb-4"
                style={{ fontFamily: "SUIT" }}
              >
                생년월일
              </h3>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <select
                    value={formData.birthYear}
                    onChange={(e) =>
                      handleInputChange(
                        "birthYear",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full h-11 sm:h-[48px] px-3 sm:px-4 border border-[#9400ea] rounded-lg bg-white text-sm sm:text-base lg:text-[18px] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    <option value="">연도</option>
                    {Array.from({ length: 50 }, (_, i) => 2024 - i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="w-20 sm:w-[92px]">
                  <select
                    value={formData.birthMonth}
                    onChange={(e) =>
                      handleInputChange(
                        "birthMonth",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full h-11 sm:h-[48px] px-2 sm:px-4 border border-[#9400ea] rounded-lg bg-white text-sm sm:text-base lg:text-[18px] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    <option value="">월</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <option key={month} value={month}>
                          {month}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="w-20 sm:w-[92px]">
                  <select
                    value={formData.birthDay}
                    onChange={(e) =>
                      handleInputChange(
                        "birthDay",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full h-11 sm:h-[48px] px-2 sm:px-4 border border-[#9400ea] rounded-lg bg-white text-sm sm:text-base lg:text-[18px] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    <option value="">일</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.birth && (
                <p
                  className="text-[#e82239] text-[12px] mt-2"
                  style={{ fontFamily: "SUIT" }}
                >
                  {errors.birth}
                </p>
              )}
            </div>
          </div>

          {/* 응원팀 선택 섹션 */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3
                className="text-base sm:text-lg lg:text-[20px] font-semibold text-[#1a1a1a] mb-2"
                style={{ fontFamily: "SUIT" }}
              >
                응원팀(중복 선택 가능)
              </h3>
              <p
                className="text-xs sm:text-[12px] text-[#666666] mb-3 sm:mb-4"
                style={{ fontFamily: "SUIT" }}
              >
                • 최대 2개의 팀까지 선택 가능합니다.
                <br />• 동일한 리그에서 2개의 팀을 선택한 경우, 다른 리그를
                선택할 수 없습니다.
              </p>

              {/* 리그 선택 그리드 */}
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
                {/* API로 가져온 리그 목록 표시 */}
                {leagues.map((league) => {
                  const isSelected = selectedLeagues.includes(league.leagueId);

                  // 동일한 리그에서 2개 팀이 선택된 경우 다른 리그 비활성화
                  const hasTwoTeamsFromSameLeague = selectedTeams.some(
                    (team) => {
                      const teamsFromSameLeague = selectedTeams.filter(
                        (t) => t.leagueId === team.leagueId
                      );
                      return teamsFromSameLeague.length >= 2;
                    }
                  );

                  const isDisabled = !isSelected && hasTwoTeamsFromSameLeague;

                  return (
                    <div
                      key={league.leagueId}
                      className={`flex flex-col items-center p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                        isDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mb-1.5 sm:mb-2 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        <Image
                          src={getLeagueImage(league.leagueId)}
                          alt={league.leagueName}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span
                        className="text-[10px] sm:text-[11px] lg:text-[12px] text-center leading-tight sm:leading-[17px] mb-1.5 sm:mb-2"
                        style={{ fontFamily: "SUIT" }}
                      >
                        {league.leagueName}
                      </span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={isDisabled}
                          onChange={() =>
                            handleLeagueSelection(league.leagueId)
                          }
                          className="w-5 h-5 border-2 border-[#dddddd] rounded-sm focus:ring-2 focus:ring-[#9400ea] appearance-none bg-gray-100 checked:bg-[#9400ea] checked:border-[#9400ea] disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {isSelected && (
                          <svg
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* "없음" 옵션 추가 */}
                {(() => {
                  const isSelected = selectedLeagues.length === 0;
                  return (
                    <div
                      key={0}
                      className="flex flex-col items-center p-1.5 sm:p-2 rounded-lg transition-all duration-200"
                    >
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mb-1.5 sm:mb-2 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        <Image
                          src="/assets/images/freeagent.png"
                          alt="없음"
                          width={64}
                          height={64}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span
                        className="text-[10px] sm:text-[11px] lg:text-[12px] text-center leading-tight sm:leading-[17px] mb-1.5 sm:mb-2"
                        style={{ fontFamily: "SUIT" }}
                      >
                        없음
                      </span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleLeagueSelection(0)}
                          className="w-5 h-5 border-2 border-[#dddddd] rounded-sm focus:ring-2 focus:ring-[#9400ea] appearance-none bg-gray-100 checked:bg-[#9400ea] checked:border-[#9400ea]"
                        />
                        {isSelected && (
                          <svg
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* 선택된 리그 표시 */}
              {selectedLeagues.length > 0 && (
                <div className="mb-3 sm:mb-4">
                  <h4
                    className="text-sm sm:text-base lg:text-[16px] font-semibold text-[#1a1a1a] mb-2"
                    style={{ fontFamily: "SUIT" }}
                  >
                    선택된 리그:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedLeagues.map((leagueId) => {
                      const league = leagues.find(
                        (l) => l.leagueId === leagueId
                      );

                      return (
                        <span
                          key={leagueId}
                          className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-[#9400ea] text-white rounded-full text-xs sm:text-sm lg:text-[14px]"
                          style={{ fontFamily: "SUIT" }}
                        >
                          {league?.leagueName}
                        </span>
                      );
                    })}
                  </div>

                  {/* 제한 상태 안내 메시지 */}
                  {(() => {
                    const hasTwoTeamsFromSameLeague = selectedTeams.some(
                      (team) => {
                        const teamsFromSameLeague = selectedTeams.filter(
                          (t) => t.leagueId === team.leagueId
                        );
                        return teamsFromSameLeague.length >= 2;
                      }
                    );

                    if (hasTwoTeamsFromSameLeague) {
                      return (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p
                            className="text-xs sm:text-[12px] text-yellow-800"
                            style={{ fontFamily: "SUIT" }}
                          >
                            ⚠️ 동일한 리그에서 2개의 팀을 선택했으므로 다른
                            리그를 선택할 수 없습니다.
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}

              {/* 팀 선택 드롭다운 */}
              {selectedLeagues.length > 0 && (
                <div className="space-y-3 sm:space-y-4">
                  <h4
                    className="text-sm sm:text-base lg:text-[16px] font-semibold text-[#1a1a1a]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    팀 선택 (최대 2개):
                  </h4>
                  {selectedLeagues.map((leagueId) => {
                    const league = leagues.find((l) => l.leagueId === leagueId);
                    if (!league) return null;

                    // 해당 리그의 팀 목록 가져오기
                    const teamsForLeague = teamsMap[leagueId] || [];

                    // 해당 리그에서 선택된 팀들
                    const selectedTeamsInLeague = selectedTeams.filter(
                      (team) => team.leagueId === leagueId
                    );

                    return (
                      <div key={leagueId} className="space-y-2">
                        <label
                          className="text-xs sm:text-sm lg:text-[14px] font-medium text-[#1a1a1a]"
                          style={{ fontFamily: "SUIT" }}
                        >
                          {league.leagueName} 팀 선택:
                        </label>
                        <select
                          className="w-full h-11 sm:h-[48px] px-3 sm:px-4 border border-[#9400ea] rounded-lg bg-white text-sm sm:text-base lg:text-[18px] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
                          style={{ fontFamily: "SUIT" }}
                          onChange={(e) => {
                            const teamId = parseInt(e.target.value);
                            handleTeamSelection(leagueId, teamId);
                            // 선택 후 드롭다운 초기화
                            e.target.value = "";
                          }}
                        >
                          <option value="">
                            {teamsForLeague.length === 0
                              ? "팀 정보를 불러오는 중..."
                              : "팀을 선택하세요"}
                          </option>
                          {teamsForLeague.map((team) => {
                            // 이미 선택된 팀은 옵션에서 제외
                            const isAlreadySelected = selectedTeams.some(
                              (selectedTeam) =>
                                selectedTeam.leagueId === leagueId &&
                                selectedTeam.teamId === team.teamId
                            );

                            return (
                              <option
                                key={team.teamId}
                                value={team.teamId}
                                disabled={isAlreadySelected}
                              >
                                {team.teamName}{" "}
                                {isAlreadySelected ? "(선택됨)" : ""}
                              </option>
                            );
                          })}
                        </select>

                        {/* 선택된 팀들 표시 */}
                        {selectedTeamsInLeague.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {selectedTeamsInLeague.map(
                              (teamSelection, index) => {
                                const team = teamsForLeague.find(
                                  (t) => t.teamId === teamSelection.teamId
                                );

                                return (
                                  <span
                                    key={index}
                                    className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-[#9400ea] text-white rounded-full text-xs sm:text-sm lg:text-[14px] flex items-center gap-1 sm:gap-2"
                                    style={{ fontFamily: "SUIT" }}
                                  >
                                    {team?.teamName}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleTeamSelection(
                                          leagueId,
                                          teamSelection.teamId
                                        )
                                      }
                                      className="text-white hover:text-red-200 text-sm sm:text-base lg:text-[16px] font-bold"
                                      aria-label={`${team?.teamName} 선택 해제`}
                                    >
                                      ×
                                    </button>
                                  </span>
                                );
                              }
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 전체 선택된 팀 요약 표시 */}
              {selectedTeams.length > 0 && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <h4
                    className="text-sm sm:text-base lg:text-[16px] font-semibold text-[#1a1a1a] mb-2"
                    style={{ fontFamily: "SUIT" }}
                  >
                    선택된 팀 요약:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeams.map((teamSelection, index) => {
                      const league = leagues.find(
                        (l) => l.leagueId === teamSelection.leagueId
                      );
                      const teamsForLeague =
                        teamsMap[teamSelection.leagueId] || [];
                      const team = teamsForLeague.find(
                        (t) => t.teamId === teamSelection.teamId
                      );

                      return (
                        <span
                          key={index}
                          className="px-2.5 sm:px-3 py-0.5 sm:py-1 bg-[#7a00c7] text-white rounded-full text-xs sm:text-sm lg:text-[14px]"
                          style={{ fontFamily: "SUIT" }}
                        >
                          {league?.leagueName} - {team?.teamName}
                        </span>
                      );
                    })}
                  </div>
                  <p
                    className="text-xs sm:text-[12px] text-gray-600 mt-2"
                    style={{ fontFamily: "SUIT" }}
                  >
                    * 동일한 리그에서 여러 팀을 선택할 수 있습니다.
                  </p>
                </div>
              )}

              {errors.selectedLeague && (
                <p
                  className="text-[#e82239] text-[12px] mt-2"
                  style={{ fontFamily: "SUIT" }}
                >
                  {errors.selectedLeague}
                </p>
              )}
              {errors.selectedTeam && (
                <p
                  className="text-[#e82239] text-[12px] mt-2"
                  style={{ fontFamily: "SUIT" }}
                >
                  {errors.selectedTeam}
                </p>
              )}
            </div>
          </div>

          {/* 회원정보 수정 버튼 */}
          <button
            type="submit"
            className="w-full h-12 sm:h-[54px] bg-[#9400ea] text-white rounded-xl font-semibold text-sm sm:text-base lg:text-[16px] hover:bg-[#7a00c7] focus:outline-none focus:ring-2 focus:ring-[#9400ea] transition-all duration-200"
            style={{ fontFamily: "SUIT" }}
          >
            회원정보 수정 완료
          </button>
        </form>
      </div>

      {/* 에러 다이얼로그 */}
      {showErrorDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 sm:p-6 mx-4 max-w-sm w-full">
            <h3
              className="text-base sm:text-lg font-semibold text-[#1a1a1a] mb-2 sm:mb-3"
              style={{ fontFamily: "SUIT" }}
            >
              회원정보 수정 실패
            </h3>
            <p
              className="text-sm sm:text-base text-[#1a1a1a] mb-5 sm:mb-6 whitespace-pre-line"
              style={{ fontFamily: "SUIT" }}
            >
              {errorMessage}
            </p>
            <button
              onClick={() => {
                setShowErrorDialog(false);
                setErrorMessage("");
              }}
              className="w-full h-11 sm:h-[48px] bg-[#9400ea] text-white rounded-xl font-semibold text-sm sm:text-base lg:text-[16px] hover:bg-[#7a00c7] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
              style={{ fontFamily: "SUIT" }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
