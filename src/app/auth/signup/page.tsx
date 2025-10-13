"use client";

import { useEffect, useState, useRef } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import { createHeaders } from "@/lib/api";
import { League, Team } from "@/types/league";

interface FormData {
  email: string;
  emailVerificationCode: string;
  password: string;
  checkPassword: string;
  name: string;
  gender: string;
  birthDate: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  leagueId: number;
  teamId: number;
  leagueId2: number;
  teamId2: number;
  personalInfoAgreement: string;
  marketingAgreement: string;
}

interface FormErrors {
  email?: string;
  emailVerificationCode?: string;
  password?: string;
  passwordConfirm?: string;
  name?: string;
  gender?: string;
  birth?: string;
  address?: string;
  idNumber?: string;
  selectedLeague?: string;
  selectedTeam?: string;
  agreeTerms?: string;
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

const SignupPage = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    emailVerificationCode: "",
    password: "",
    checkPassword: "",
    name: "",
    gender: "",
    birthDate: "",
    birthYear: 0,
    birthMonth: 0,
    birthDay: 0,
    leagueId: -1,
    teamId: -1,
    leagueId2: 0,
    teamId2: 0,
    personalInfoAgreement: "",
    marketingAgreement: "",
  });

  // 선택된 리그/팀 관리를 위한 상태
  const [selectedLeagues, setSelectedLeagues] = useState<number[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<
    { leagueId: number; teamId: number }[]
  >([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showTerms, setShowTerms] = useState(false);
  const { data, execute, loading, error } = useApi();
  const isInitialLoad = useRef(false); // API 호출이 한 번만 실행되도록 ref 사용
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teamsMap, setTeamsMap] = useState<Record<number, Team[]>>({});

  // 이메일 인증 관련 상태
  const [authCode, setAuthCode] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [showTimeoutDialog, setShowTimeoutDialog] = useState<boolean>(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [showErrorDialog, setShowErrorDialog] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 페이지 진입 시 호출되는 api 중복 호출 방지 처리
    if (isInitialLoad.current) {
      return;
    }

    // 회원 가입 시 필요한 리그 목록 api 호출
    const callAllLeagues = async () => {
      try {
        const response = await execute("/api/v1/league/all", {
          method: "GET",
          headers: await createHeaders(false),
        });

        const res = response;

        // 리그 목록 API 응답 처리
        if (res && typeof res !== "string" && res.statusCode === "FO-200") {
          const leagueData = res.data;

          // 응답 데이터 검증
          if (!leagueData || !Array.isArray(leagueData)) {
            // console.warn("유효하지 않은 리그 API 응답:", leagueData);
            return;
          }

          // 데이터가 비어있는 경우 처리
          if (leagueData.length === 0) {
            // console.log("반환된 리그 데이터가 없습니다.");
            return;
          }

          const getLeagueList = leagueData
            .map((league: League) => {
              // 각 멤버 데이터의 필수 필드 검증
              if (!league || typeof league.leagueId === "undefined") {
                // console.warn("유효하지 않은 리그 데이터:", league);
                return null;
              }

              return league;
            })
            .filter(
              (league: League | null): league is League => league !== null
            ); // null 값 제거

          if (getLeagueList.length > 0) {
            setLeagues([...leagues, ...getLeagueList]); // 기존 샘플 데이터를 대체
            // console.log(
            //   `${getLeagueList.length}개의 리그 데이터를 로드했습니다.`
            // );
          }
        } else {
          // console.warn("리그 목록 API 응답 예외 오류 발생");
        }
      } catch (error) {}
    };

    // 회원 가입 시 리그 목록 호출 함수 실행행
    callAllLeagues();

    isInitialLoad.current = true;
  }, [leagues, isInitialLoad]);

  const handleLeagueSelection = (leagueId: number) => {
    if (leagueId === 0) {
      // "없음" 선택 시 모든 선택 초기화
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

    const isSelected = selectedLeagues.includes(leagueId);

    if (isSelected) {
      // 이미 선택된 리그 해제
      const newSelectedLeagues = selectedLeagues.filter(
        (id) => id !== leagueId
      );
      const newSelectedTeams = selectedTeams.filter(
        (team) => team.leagueId !== leagueId
      );

      setSelectedLeagues(newSelectedLeagues);
      setSelectedTeams(newSelectedTeams);

      // formData 업데이트
      updateFormDataFromSelections(newSelectedLeagues, newSelectedTeams);
    } else {
      // 새로운 리그 선택 시 제한 조건 확인
      if (selectedLeagues.length >= 2) {
        alert("최대 2개의 리그까지 선택할 수 있습니다.");
        return;
      }

      // 동일한 리그에서 2개 팀이 이미 선택된 경우 다른 리그 선택 제한
      const hasTwoTeamsFromSameLeague = selectedTeams.some((team) => {
        const teamsFromSameLeague = selectedTeams.filter(
          (t) => t.leagueId === team.leagueId
        );
        return teamsFromSameLeague.length >= 2;
      });

      if (hasTwoTeamsFromSameLeague) {
        alert(
          "동일한 리그에서 2개의 팀을 선택한 경우, 다른 리그를 선택할 수 없습니다."
        );
        return;
      }

      const newSelectedLeagues = [...selectedLeagues, leagueId];
      setSelectedLeagues(newSelectedLeagues);

      // 해당 리그의 팀 목록 가져오기
      getAvailableTeams(leagueId);
    }
  };

  const handleTeamSelection = (leagueId: number, teamId: number) => {
    if (teamId === 0) {
      // "없음" 팀 선택 시 해당 리그의 모든 팀 선택 해제
      const newSelectedTeams = selectedTeams.filter(
        (team) => team.leagueId !== leagueId
      );
      setSelectedTeams(newSelectedTeams);
      updateFormDataFromSelections(selectedLeagues, newSelectedTeams);
      return;
    }

    // 동일한 리그에서 동일한 팀이 이미 선택되어 있는지 확인
    const existingTeamIndex = selectedTeams.findIndex(
      (team) => team.leagueId === leagueId && team.teamId === teamId
    );

    if (existingTeamIndex >= 0) {
      // 이미 선택된 팀이면 해제
      const newSelectedTeams = selectedTeams.filter(
        (_, index) => index !== existingTeamIndex
      );
      setSelectedTeams(newSelectedTeams);
      updateFormDataFromSelections(selectedLeagues, newSelectedTeams);
    } else {
      // 새로운 팀 선택
      if (selectedTeams.length >= 2) {
        alert("최대 2개의 팀까지 선택할 수 있습니다.");
        return;
      }

      const newSelectedTeams = [...selectedTeams, { leagueId, teamId }];
      setSelectedTeams(newSelectedTeams);
      updateFormDataFromSelections(selectedLeagues, newSelectedTeams);
    }
  };

  const updateFormDataFromSelections = (
    leagues: number[],
    teams: { leagueId: number; teamId: number }[]
  ) => {
    if (teams.length === 0) {
      // 선택된 팀이 없으면 "없음" 상태
      setFormData((prev) => ({
        ...prev,
        leagueId: 0,
        teamId: 0,
        leagueId2: 0,
        teamId2: 0,
      }));
    } else if (teams.length === 1) {
      // 1개 팀 선택
      setFormData((prev) => ({
        ...prev,
        leagueId: teams[0].leagueId,
        teamId: teams[0].teamId,
        leagueId2: 0,
        teamId2: 0,
      }));
    } else if (teams.length === 2) {
      // 2개 팀 선택 - 동일한 리그에서도 선택 가능
      setFormData((prev) => ({
        ...prev,
        leagueId: teams[0].leagueId,
        teamId: teams[0].teamId,
        leagueId2: teams[1].leagueId, // 동일한 리그 ID가 들어갈 수 있음
        teamId2: teams[1].teamId,
      }));
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 에러 클리어
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const getAvailableTeams = async (leagueId: number) => {
    if (leagueId === 0) {
      // leagueId가 0 (없음)인 경우 처리
      return;
    }

    // 이미 로드된 팀 데이터가 있으면 재사용
    if (teamsMap[leagueId]) {
      return teamsMap[leagueId];
    }

    try {
      const response = await execute("/api/v1/team/all?leagueId=" + leagueId, {
        headers: await createHeaders(false),
        method: "GET",
      });

      const res = response;

      if (res && typeof res !== "string" && res.statusCode === "FO-200") {
        const teamData = res.data;

        if (!teamData || !Array.isArray(teamData)) {
          // console.warn("유효하지 않은 팀 API 응답:", teamData);
          return [];
        }

        const getTeamList = teamData
          .map((team: Team) => {
            if (!team || typeof team.teamId === "undefined") {
              // console.warn("유효하지 않은 팀 데이터:", team);
              return null;
            }

            return team;
          })
          .filter((team: Team | null): team is Team => team !== null);

        if (getTeamList.length > 0) {
          // teamsMap에 저장
          setTeamsMap((prev) => ({
            ...prev,
            [leagueId]: getTeamList,
          }));
          // console.log(`${getTeamList.length}개의 팀 데이터를 로드했습니다.`);
          return getTeamList;
        } else {
          // console.log("해당 리그에 팀 데이터가 없습니다.");
          return [];
        }
      } else {
        // console.warn("팀 목록 API 응답 예외 오류 발생");
        return [];
      }
    } catch (error) {
      // console.error("팀 목록 API 호출 중 오류 발생:", error);
      return [];
    }
  };

  // 타이머 관리 useEffect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      // 타이머 종료
      setIsTimerActive(false);
      setAuthCode("");
      setShowTimeoutDialog(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeLeft, isTimerActive]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleEmailVerification = async () => {
    if (!formData.email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      // [운영]
      const API_URL = "http://1.234.75.29:8093/api/v1/member/email/authorize";

      // [개발]
      // const API_URL = "http://1.234.75.29:9093/api/v1/member/email/authorize";

      // [로컬]
      // const API_URL = "http://localhost:8093/api/v1/member/email/authorize";

      const response = await execute(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      // console.log("이메일 인증 API 응답:", response);

      if (
        response &&
        typeof response !== "string" &&
        response.statusCode === "FO-200"
      ) {
        const authCode = response.data as string;
        // 인증 성공
        setAuthCode(authCode);
        setTimeLeft(180); // 3분 = 180초
        setIsTimerActive(true);
        alert("인증번호가 이메일로 전송되었습니다.");
      } else {
        alert("이메일 인증 요청에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      // console.error("이메일 인증 API 오류:", error);
      alert("이메일 인증 요청 중 오류가 발생했습니다.");
    }
  };

  const handleVerificationCodeCheck = () => {
    if (!formData.emailVerificationCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    if (formData.emailVerificationCode === authCode) {
      setIsEmailVerified(true);
      setIsTimerActive(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      alert("이메일 인증이 완료되었습니다.");
    } else {
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 디버깅을 위한 로그
    // console.log(
    //   "유효성 검사 - leagueId:",
    //   formData.leagueId,
    //   typeof formData.leagueId
    // );
    // console.log(
    //   "유효성 검사 - teamId:",
    //   formData.teamId,
    //   typeof formData.teamId
    // );

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식이 아닙니다.";
    }

    // 인증번호 검증
    if (!formData.emailVerificationCode) {
      newErrors.emailVerificationCode = "인증번호를 입력해주세요.";
    }

    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/.test(
        formData.password
      )
    ) {
      newErrors.password = "영문, 숫자, 특수문자 포함 8~20자까지 입력하세요.";
    }

    // 비밀번호 확인 검증
    if (!formData.checkPassword) {
      newErrors.passwordConfirm = "비밀번호를 다시 입력해주세요.";
    } else if (formData.password !== formData.checkPassword) {
      newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }

    // 이름 검증
    if (!formData.name) {
      newErrors.name = "이름을 입력해주세요.";
    }

    // 성별 검증
    if (!formData.gender) {
      newErrors.gender = "성별을 선택해주세요.";
    }

    // 생년월일 검증
    if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
      newErrors.birth = "생년월일을 모두 선택해주세요.";
    }

    // 주소 검증
    // if (!formData.address) {
    //   newErrors.address = "주소를 입력해주세요.";
    // }

    // 주민번호 검증
    // if (!formData.idNumber) {
    //   newErrors.idNumber = "주민번호를 입력해주세요.";
    // }

    // 응원 리그 검증 (0은 "없음", -1은 미선택)
    if (formData.leagueId === -1) {
      newErrors.selectedLeague = "응원 리그를 선택해주세요.";
    }

    // 응원팀 검증 (0은 "없음", -1은 미선택)
    if (formData.teamId === -1) {
      newErrors.selectedTeam = "응원팀을 선택해주세요.";
    }

    // 필수 동의 항목 검증
    if (!formData.personalInfoAgreement) {
      newErrors.agreeTerms = "개인정보 수집 및 이용 동의는 필수입니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert(
        "마케팅 및 카카오톡 알림 메시지 수신 동의를 제외한 나머지 정보를 모두 입력해주세요."
      );
      return;
    }

    // 이메일 인증번호 확인
    if (!authCode) {
      alert("이메일 인증을 먼저 진행해주세요.");
      return;
    }

    if (formData.emailVerificationCode !== authCode) {
      alert("인증번호가 일치하지 않습니다. 다시 확인해주세요.");
      return;
    }

    // 생년월일 합치기 (YYYYMMDD 형식)
    const birthDate = `${formData.birthYear}${formData.birthMonth
      .toString()
      .padStart(2, "0")}${formData.birthDay.toString().padStart(2, "0")}`;

    // 디버깅을 위한 로그
    // console.log("생년월일 디버깅:");
    // console.log("birthYear:", formData.birthYear, typeof formData.birthYear);
    // console.log("birthMonth:", formData.birthMonth, typeof formData.birthMonth);
    // console.log("birthDay:", formData.birthDay, typeof formData.birthDay);
    // console.log("생성된 birthDate:", birthDate, "길이:", birthDate.length);

    // 생년월일 형식 재검증
    if (
      birthDate.length !== 8 ||
      birthDate.includes("NaN") ||
      birthDate.includes("undefined")
    ) {
      alert("생년월일을 올바르게 선택해주세요.");
      return;
    }

    // 성별 변환 (male -> M, female -> F)
    const gender =
      formData.gender === "male"
        ? "M"
        : formData.gender === "female"
        ? "F"
        : "";

    // 선택된 팀 정보를 첫 번째와 두 번째로 분리
    const firstTeam = selectedTeams[0] || { leagueId: 0, teamId: 0 };
    const secondTeam = selectedTeams[1] || { leagueId: 0, teamId: 0 };

    const requestData = {
      email: formData.email,
      emailVerificationCode: authCode,
      password: formData.password,
      checkPassword: formData.checkPassword,
      name: formData.name,
      gender: gender,
      birthDate: birthDate,
      leagueId: firstTeam.leagueId,
      teamId: firstTeam.teamId,
      leagueId2: secondTeam.leagueId,
      teamId2: secondTeam.teamId,
      personalInfoAgreement: formData.personalInfoAgreement === "y" ? "y" : "n",
      marketingAgreement: formData.marketingAgreement === "y" ? "y" : "n",
    };

    // console.log("전송할 회원가입 데이터:", requestData);
    // console.log(
    //   "리그/팀 선택 확인 - leagueId:",
    //   formData.leagueId,
    //   "teamId:",
    //   formData.teamId,
    //   "leagueId2:",
    //   formData.leagueId2,
    //   "teamId2:",
    //   formData.teamId2
    // );
    // console.log("선택된 팀들:", selectedTeams);

    try {
      const response = await execute("/api/v1/member/regist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      // console.log("회원가입 API 응답:", response);

      if (
        response &&
        typeof response !== "string" &&
        response.statusCode === "FO-200"
      ) {
        // 회원가입 성공
        setShowSuccessDialog(true);
      } else {
        // 회원가입 실패 - 서버에서 반환한 오류 메시지 표시
        const errorMsg =
          response && typeof response !== "string" && response.data
            ? (response.data as string)
            : "회원가입에 실패했습니다. 다시 시도해주세요.";
        setErrorMessage(errorMsg);
        setShowErrorDialog(true);
      }
    } catch (error) {
      // console.error("회원가입 API 오류:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 mt-16 sm:mt-20 mb-16 sm:mb-20">
      <div className="w-full max-w-[600px] space-y-6 sm:space-y-10">
        {/* 헤더 섹션 */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-2">
            <Image
              src={"/assets/images/fillo_brand_text.png"}
              alt="Fillo Logo"
              width={115}
              height={58}
              className="object-contain w-20 sm:w-24 lg:w-[115px]"
            />
            <h1
              className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-[#1a1a1a] mb-2 leading-tight sm:leading-[62px]"
              style={{ fontFamily: "SUIT" }}
            >
              {" 계정 생성 "}
            </h1>
          </div>

          <p
            className="text-base sm:text-[18px] font-semibold text-[#1a1a1a] leading-relaxed sm:leading-[29px]"
            style={{ fontFamily: "SUIT" }}
          >
            회원가입 후 Fillo를 이용해보세요.
          </p>
        </div>

        {/* 회원가입 폼 */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* 이메일 인증 섹션 */}
          <div className="space-y-4">
            <div>
              <h3
                className="text-[20px] font-semibold text-[#1a1a1a] mb-2"
                style={{ fontFamily: "SUIT" }}
              >
                아이디
              </h3>
              <p
                className="text-[12px] text-[#1a1a1a] mb-1"
                style={{ fontFamily: "SUIT" }}
              >
                로그인에 사용될 이메일 주소를 입력해주세요.
              </p>
              <p
                className="text-[12px] text-[#1a1a1a] mb-4"
                style={{ fontFamily: "SUIT" }}
              >
                이메일이 오지 않으면 스팸 메일함을 확인하시거나, 이메일 인증을
                다시 눌러주세요.
              </p>

              <div className="flex space-x-2">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="이메일 주소를 입력하세요."
                  className="flex-1 h-[48px] px-4 border border-[#9400ea] rounded-lg bg-white text-[18px] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
                  style={{ fontFamily: "SUIT" }}
                />
                <button
                  type="button"
                  onClick={handleEmailVerification}
                  className="h-[48px] px-4 bg-[#9400ea] text-white rounded-xl font-semibold text-[16px] hover:bg-[#7a00c7] focus:outline-none focus:ring-2 focus:ring-[#9400ea] whitespace-nowrap"
                  style={{ fontFamily: "SUIT" }}
                >
                  이메일 인증
                </button>
              </div>

              <div className="flex space-x-2 mt-2 justify-between">
                <input
                  type="text"
                  value={formData.emailVerificationCode}
                  onChange={(e) =>
                    handleInputChange("emailVerificationCode", e.target.value)
                  }
                  placeholder="인증번호 입력"
                  maxLength={6}
                  className="w-[150px] h-[48px] px-4 border border-[#9400ea] rounded-lg bg-white text-[18px] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
                  style={{ fontFamily: "SUIT" }}
                />
                <button
                  type="button"
                  onClick={handleVerificationCodeCheck}
                  disabled={!isTimerActive || !authCode}
                  className="h-[48px] px-4 bg-gray-500 text-white rounded-xl font-semibold text-[16px] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  style={{ fontFamily: "SUIT" }}
                >
                  인증번호 확인
                </button>
              </div>

              {isTimerActive && (
                <p
                  className="text-[12px] text-[#555555] mt-2"
                  style={{ fontFamily: "SUIT" }}
                >
                  {formatTime(timeLeft)}
                </p>
              )}
              {errors.email && (
                <p
                  className="text-[#e82239] text-[12px] mt-2"
                  style={{ fontFamily: "SUIT" }}
                >
                  {errors.email}
                </p>
              )}
              {errors.emailVerificationCode && (
                <p
                  className="text-[#e82239] text-[12px] mt-2"
                  style={{ fontFamily: "SUIT" }}
                >
                  {errors.emailVerificationCode}
                </p>
              )}
            </div>
          </div>

          {/* 비밀번호 섹션 */}
          <div className="space-y-4">
            <div>
              <h3
                className="text-[20px] font-semibold text-[#1a1a1a] mb-2"
                style={{ fontFamily: "SUIT" }}
              >
                비밀번호
              </h3>
              <p
                className="text-[12px] text-[#1a1a1a] mb-4"
                style={{ fontFamily: "SUIT" }}
              >
                영문, 숫자, 특수문자 포함 8~20자까지 입력하세요.
              </p>

              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="비밀번호를 입력하세요."
                    className="w-full h-[48px] px-4 pr-12 border border-[#9400ea] rounded-lg bg-white text-[18px] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
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

                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    value={formData.checkPassword}
                    onChange={(e) =>
                      handleInputChange("checkPassword", e.target.value)
                    }
                    placeholder="비밀번호를 다시 입력하세요."
                    className="w-full h-[48px] px-4 pr-12 border border-[#9400ea] rounded-lg bg-white text-[18px] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
                    style={{ fontFamily: "SUIT" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
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
          <div className="space-y-4">
            <div className="border border-[#9400ea] rounded-lg p-5 bg-white">
              <div className="h-[480px] overflow-y-auto">
                <div className="space-y-4">
                  <h4
                    className="text-[16px] font-semibold text-[#1a1a1a]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    제1조 (목적)
                  </h4>
                  <p
                    className="text-[14px] text-[#1a1a1a] leading-[20px]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    본 약관은 Fillo 서비스(이하 &quot;서비스&quot;)의 이용과
                    관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을
                    규정함을 목적으로 합니다.
                  </p>

                  <h4
                    className="text-[16px] font-semibold text-[#1a1a1a]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    제2조 (정의)
                  </h4>
                  <p
                    className="text-[14px] text-[#1a1a1a] leading-[20px]"
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
                    className="text-[16px] font-semibold text-[#1a1a1a]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    제3조 (개인정보 수집 및 이용)
                  </h4>
                  <p
                    className="text-[14px] text-[#1a1a1a] leading-[20px]"
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
                    className="text-[16px] font-semibold text-[#1a1a1a]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    제4조 (마케팅 정보 수신 동의)
                  </h4>
                  <p
                    className="text-[14px] text-[#1a1a1a] leading-[20px]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    회사는 이용자의 동의 하에 이메일 및 카카오톡을 통해 마케팅
                    정보를 제공할 수 있습니다. 동의하지 않아도 서비스 이용이
                    가능하며, 동의 후에도 언제든지 철회할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative flex flex-row items-center justify-between">
                <span
                  className="text-[16px] text-[#000000]"
                  style={{ fontFamily: "SUIT" }}
                >
                  <span className="text-[#9400ea] font-bold">[필수]</span>{" "}
                  개인정보 수집 및 이용 동의
                </span>
                <input
                  type="checkbox"
                  checked={formData.personalInfoAgreement === "y"}
                  onChange={(e) =>
                    handleInputChange(
                      "personalInfoAgreement",
                      e.target.checked ? "y" : "n"
                    )
                  }
                  className="w-5 h-5 border-2 border-[#dddddd] rounded-sm focus:ring-2 focus:ring-[#9400ea] appearance-none bg-white checked:bg-[#9400ea] checked:border-[#9400ea]"
                />
                {formData.personalInfoAgreement === "y" && (
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

              <div className="relative flex flex-row items-center justify-between">
                <div>
                  <span
                    className="text-[16px] text-[#000000]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    <span className="font-bold">[선택]</span> 마케팅(이메일) 및
                    카카오톡 알림 메시지를 수신에 동의합니다.
                  </span>
                </div>
                <div>
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
          <div className="space-y-4">
            <div>
              <h3
                className="text-[20px] font-semibold text-[#1a1a1a] mb-4"
                style={{ fontFamily: "SUIT" }}
              >
                이름
              </h3>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="이름 입력"
                className="w-full h-[48px] px-4 border border-[#9400ea] rounded-lg bg-white text-[18px] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
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
          <div className="space-y-4">
            <div>
              <h3
                className="text-[20px] font-semibold text-[#1a1a1a] mb-4"
                style={{ fontFamily: "SUIT" }}
              >
                성별
              </h3>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.gender === "male"}
                      onChange={(e) =>
                        handleInputChange(
                          "gender",
                          e.target.checked ? "male" : ""
                        )
                      }
                      className="w-6 h-6 border-2 border-[#dddddd] rounded-sm focus:ring-2 focus:ring-[#9400ea] appearance-none bg-gray-100 checked:bg-[#9400ea] checked:border-[#9400ea]"
                    />
                    {formData.gender === "male" && (
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
                    className="text-[18px] text-[#1a1a1a]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    남성
                  </span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={formData.gender === "female"}
                      onChange={(e) =>
                        handleInputChange(
                          "gender",
                          e.target.checked ? "female" : ""
                        )
                      }
                      className="w-6 h-6 border-2 border-[#dddddd] rounded-sm focus:ring-2 focus:ring-[#9400ea] appearance-none bg-gray-100 checked:bg-[#9400ea] checked:border-[#9400ea]"
                    />
                    {formData.gender === "female" && (
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
                    className="text-[18px] text-[#1a1a1a]"
                    style={{ fontFamily: "SUIT" }}
                  >
                    여성
                  </span>
                </label>
              </div>
              {errors.gender && (
                <p
                  className="text-[#e82239] text-[12px] mt-2"
                  style={{ fontFamily: "SUIT" }}
                >
                  {errors.gender}
                </p>
              )}
            </div>
          </div>

          {/* 생년월일 */}
          <div className="space-y-4">
            <div>
              <h3
                className="text-[20px] font-semibold text-[#1a1a1a] mb-4"
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
                    className="w-full h-[48px] px-4 border border-[#9400ea] rounded-lg bg-white text-[18px] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
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
                <div className="w-[92px]">
                  <select
                    value={formData.birthMonth}
                    onChange={(e) =>
                      handleInputChange(
                        "birthMonth",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full h-[48px] px-4 border border-[#9400ea] rounded-lg bg-white text-[18px] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
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
                <div className="w-[92px]">
                  <select
                    value={formData.birthDay}
                    onChange={(e) =>
                      handleInputChange(
                        "birthDay",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full h-[48px] px-4 border border-[#9400ea] rounded-lg bg-white text-[18px] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
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
          <div className="space-y-4">
            <div>
              <h3
                className="text-[20px] font-semibold text-[#1a1a1a] mb-2"
                style={{ fontFamily: "SUIT" }}
              >
                응원팀(중복 선택 가능)
              </h3>
              <p
                className="text-[12px] text-[#666666] mb-4"
                style={{ fontFamily: "SUIT" }}
              >
                • 최대 2개의 팀까지 선택 가능합니다.
                <br />• 동일한 리그에서 2개의 팀을 선택한 경우, 다른 리그를
                선택할 수 없습니다.
              </p>

              {/* 리그 선택 그리드 */}
              <div className="grid grid-cols-5 gap-4 mb-6">
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
                      className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${
                        isDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <div className="w-16 h-16 mb-2 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        <Image
                          src={getLeagueImage(league.leagueId)}
                          alt={league.leagueName}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span
                        className="text-[12px] text-center leading-[17px] mb-2"
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
                          className="w-4 h-4 border-2 border-[#dddddd] rounded-sm focus:ring-2 focus:ring-[#9400ea] appearance-none bg-gray-100 checked:bg-[#9400ea] checked:border-[#9400ea] disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {isSelected && (
                          <svg
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 text-white pointer-events-none"
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
                      className="flex flex-col items-center p-2 rounded-lg transition-all duration-200"
                    >
                      <div className="w-16 h-16 mb-2 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        <Image
                          src="/assets/images/freeagent.png"
                          alt="없음"
                          width={64}
                          height={64}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span
                        className="text-[12px] text-center leading-[17px] mb-2"
                        style={{ fontFamily: "SUIT" }}
                      >
                        없음
                      </span>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleLeagueSelection(0)}
                          className="w-4 h-4 border-2 border-[#dddddd] rounded-sm focus:ring-2 focus:ring-[#9400ea] appearance-none bg-gray-100 checked:bg-[#9400ea] checked:border-[#9400ea]"
                        />
                        {isSelected && (
                          <svg
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 text-white pointer-events-none"
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
                <div className="mb-4">
                  <h4
                    className="text-[16px] font-semibold text-[#1a1a1a] mb-2"
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
                          className="px-3 py-1 bg-[#9400ea] text-white rounded-full text-[14px]"
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
                            className="text-[12px] text-yellow-800"
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
                <div className="space-y-4">
                  <h4
                    className="text-[16px] font-semibold text-[#1a1a1a]"
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
                          className="text-[14px] font-medium text-[#1a1a1a]"
                          style={{ fontFamily: "SUIT" }}
                        >
                          {league.leagueName} 팀 선택:
                        </label>
                        <select
                          className="w-full h-[48px] px-4 border border-[#9400ea] rounded-lg bg-white text-[18px] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
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
                                    className="px-3 py-1 bg-[#9400ea] text-white rounded-full text-[14px] flex items-center gap-2"
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
                                      className="text-white hover:text-red-200 text-[16px] font-bold"
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
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4
                    className="text-[16px] font-semibold text-[#1a1a1a] mb-2"
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
                          className="px-3 py-1 bg-[#7a00c7] text-white rounded-full text-[14px]"
                          style={{ fontFamily: "SUIT" }}
                        >
                          {league?.leagueName} - {team?.teamName}
                        </span>
                      );
                    })}
                  </div>
                  <p
                    className="text-[12px] text-gray-600 mt-2"
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

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="w-full h-[54px] bg-[#9400ea] text-white rounded-xl font-semibold text-[16px] hover:bg-[#7e00c6] focus:outline-none focus:ring-2 focus:ring-[#9400ea] transition-all duration-200"
            style={{ fontFamily: "SUIT" }}
          >
            계정 생성
          </button>
        </form>
      </div>

      {/* 다이얼로그들 */}
      {showTimeoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full">
            <h3
              className="text-lg font-semibold text-[#1a1a1a] mb-3"
              style={{ fontFamily: "SUIT" }}
            >
              인증 시간 만료
            </h3>
            <p className="text-[#1a1a1a] mb-6" style={{ fontFamily: "SUIT" }}>
              인증번호 입력 시간이 만료되었습니다. 다시 이메일 인증을
              받아주세요.
            </p>
            <button
              onClick={() => setShowTimeoutDialog(false)}
              className="w-full h-[48px] bg-[#9400ea] text-white rounded-xl font-semibold text-[16px] hover:bg-[#7a00c7] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
              style={{ fontFamily: "SUIT" }}
            >
              확인
            </button>
          </div>
        </div>
      )}

      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full">
            <h3
              className="text-lg font-semibold text-[#1a1a1a] mb-3"
              style={{ fontFamily: "SUIT" }}
            >
              회원가입 완료
            </h3>
            <p className="text-[#1a1a1a] mb-6" style={{ fontFamily: "SUIT" }}>
              회원가입이 성공적으로 완료되었습니다. 로그인 페이지로 이동합니다.
            </p>
            <button
              onClick={() => {
                setShowSuccessDialog(false);
                window.location.href = "/auth/login";
              }}
              className="w-full h-[48px] bg-[#9400ea] text-white rounded-xl font-semibold text-[16px] hover:bg-[#7a00c7] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
              style={{ fontFamily: "SUIT" }}
            >
              로그인 페이지로 이동
            </button>
          </div>
        </div>
      )}

      {showErrorDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 mx-4 max-w-sm w-full">
            <h3
              className="text-lg font-semibold text-[#1a1a1a] mb-3"
              style={{ fontFamily: "SUIT" }}
            >
              회원가입 실패
            </h3>
            <p
              className="text-[#1a1a1a] mb-6 whitespace-pre-line"
              style={{ fontFamily: "SUIT" }}
            >
              {errorMessage}
            </p>
            <button
              onClick={() => {
                setShowErrorDialog(false);
                setErrorMessage("");
              }}
              className="w-full h-[48px] bg-[#9400ea] text-white rounded-xl font-semibold text-[16px] hover:bg-[#7a00c7] focus:outline-none focus:ring-2 focus:ring-[#9400ea]"
              style={{ fontFamily: "SUIT" }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
