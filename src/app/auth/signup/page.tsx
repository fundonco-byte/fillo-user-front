"use client";

import { useEffect, useState, useRef } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
// import filloLogo from "@/assets/images/fillo_logo.png";
import { useApi } from "@/hooks/useApi";
import { createHeaders } from "@/lib/api";
// import { ApiResponse, AuthTokens } from "@/types/auth";
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

// 리그별 팀 데이터
const leagueTeams = (league: League) => [
  {
    leagueId: 1,
    leagueName: "프리미어리그",
    relatedTeams: [
      {
        teamId: 1,
        teamName: "아스날",
      },
      {
        teamId: 2,
        teamName: "첼시",
      },
      {
        teamId: 3,
        teamName: "맨시티",
      },
      {
        teamId: 4,
        teamName: "맨유",
      },
      {
        teamId: 5,
        teamName: "리버풀",
      },
      {
        teamId: 6,
        teamName: "토트넘",
      },
      {
        teamId: 7,
        teamName: "뉴캐슬",
      },
    ],
  },
  {
    leagueId: 2,
    leagueName: "라리가",
    relatedTeams: [
      {
        teamId: 1,
        teamName: "바르셀로나",
      },
      {
        teamId: 2,
        teamName: "레알 마드리드",
      },
    ],
  },
  {
    leagueId: 3,
    leagueName: "분데스리가",
    relatedTeams: [
      {
        teamId: 1,
        teamName: "바이에른 뮌헨",
      },
      {
        teamId: 2,
        teamName: "도르트문트",
      },
      {
        teamId: 3,
        teamName: "레버쿠젠",
      },
    ],
  },
  {
    leagueId: 4,
    leagueName: "세리에A",
    relatedTeams: [
      {
        teamId: 1,
        teamName: "인터밀란",
      },
      {
        teamId: 2,
        teamName: "AC밀란",
      },
      {
        teamId: 3,
        teamName: "유벤투스",
      },
      {
        teamId: 4,
        teamName: "아탈란타",
      },
      {
        teamId: 5,
        teamName: "AS로마",
      },
    ],
  },
  {
    leagueId: 5,
    leagueName: "리그앙",
    relatedTeams: [
      {
        teamId: 1,
        teamName: "PSG",
      },
      {
        teamId: 2,
        teamName: "리옹",
      },
      {
        teamId: 3,
        teamName: "마르세유",
      },
    ],
  },
  {
    leagueId: 0,
    leagueName: "없음",
    relatedTeams: [
      {
        teamId: 0,
        teamName: "없음",
      },
    ],
  },
];

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
    personalInfoAgreement: "",
    marketingAgreement: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showTerms, setShowTerms] = useState(false);
  const { data, execute, loading, error } = useApi();
  const isInitialLoad = useRef(false); // API 호출이 한 번만 실행되도록 ref 사용
  const [leagues, setLeagues] = useState<League[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

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
        if (typeof res !== "string" && res.statusCode === "FO-200") {
          const leagueData = res.data;

          // 응답 데이터 검증
          if (!leagueData || !Array.isArray(leagueData)) {
            console.warn("유효하지 않은 리그 API 응답:", leagueData);
            return;
          }

          // 데이터가 비어있는 경우 처리
          if (leagueData.length === 0) {
            console.log("반환된 리그 데이터가 없습니다.");
            return;
          }

          const getLeagueList = leagueData
            .map((league: League) => {
              // 각 멤버 데이터의 필수 필드 검증
              if (!league || typeof league.leagueId === "undefined") {
                console.warn("유효하지 않은 리그 데이터:", league);
                return null;
              }

              return league;
            })
            .filter(
              (league: League | null): league is League => league !== null
            ); // null 값 제거

          if (getLeagueList.length > 0) {
            setLeagues([...leagues, ...getLeagueList]); // 기존 샘플 데이터를 대체
            console.log(
              `${getLeagueList.length}개의 리그 데이터를 로드했습니다.`
            );
          }
        } else {
          console.warn("리그 목록 API 응답 예외 오류 발생");
        }
      } catch (error) {}
    };

    // 회원 가입 시 리그 목록 호출 함수 실행행
    callAllLeagues();

    isInitialLoad.current = true;
  }, [leagues, isInitialLoad]);

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean | number
  ) => {
    // setFormData((prev) => ({
    //   ...prev,
    //   [field]: value,
    // }));

    // 리그 변경 시 팀 초기화
    if (field === "leagueId") {
      const leagueId = value as number;
      getAvailableTeams(leagueId);

      setFormData((prev) => ({
        ...prev,
        leagueId: leagueId,
        teamId: -1, // 리그 변경 시 팀 선택 초기화
      }));
    } else {
      // 일반적인 필드 업데이트
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

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
      // leagueId가 0 (없음)인 경우 "없음" 팀만 설정
      setTeams([{ teamId: 0, teamName: "없음", leagueId: 0 }]);
      // "없음" 팀 자동 선택
      setFormData((prev) => ({
        ...prev,
        teamId: 0,
      }));
      // return [];
    } else {
      try {
        const response = await execute(
          "/api/v1/team/all?leagueId=" + leagueId,
          {
            headers: await createHeaders(false),
            method: "GET",
          }
        );

        const res = response;

        if (typeof res !== "string" && res.statusCode === "FO-200") {
          const teamData = res.data;

          if (!teamData || !Array.isArray(teamData)) {
            console.warn("유효하지 않은 팀 API 응답:", teamData);
            setTeams([]);
            return [];
          }

          const getTeamList = teamData
            .map((team: Team) => {
              if (!team || typeof team.teamId === "undefined") {
                console.warn("유효하지 않은 팀 데이터:", team);
                return null;
              }

              console.log("로드된 팀 데이터:", team);
              return team;
            })
            .filter((team: Team | null): team is Team => team !== null);

          if (getTeamList.length > 0) {
            setTeams(getTeamList);
            console.log(`${getTeamList.length}개의 팀 데이터를 로드했습니다.`);
            console.log("로드된 팀 데이터:", getTeamList);
          } else {
            setTeams([]);
            console.log("해당 리그에 팀 데이터가 없습니다.");
          }
        } else {
          console.warn("팀 목록 API 응답 예외 오류 발생");
          setTeams([]);
        }
      } catch (error) {
        console.error("팀 목록 API 호출 중 오류 발생:", error);
        setTeams([]);
      }
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
      const response = await execute(
        "http://1.234.75.29:8093/api/v1/member/email/authorize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
          }),
        }
      );

      console.log("이메일 인증 API 응답:", response);

      if (typeof response !== "string" && response.statusCode === "FO-200") {
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
      console.error("이메일 인증 API 오류:", error);
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
    console.log(
      "유효성 검사 - leagueId:",
      formData.leagueId,
      typeof formData.leagueId
    );
    console.log(
      "유효성 검사 - teamId:",
      formData.teamId,
      typeof formData.teamId
    );

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
    console.log("생년월일 디버깅:");
    console.log("birthYear:", formData.birthYear, typeof formData.birthYear);
    console.log("birthMonth:", formData.birthMonth, typeof formData.birthMonth);
    console.log("birthDay:", formData.birthDay, typeof formData.birthDay);
    console.log("생성된 birthDate:", birthDate, "길이:", birthDate.length);

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

    const requestData = {
      email: formData.email,
      emailVerificationCode: authCode,
      password: formData.password,
      checkPassword: formData.checkPassword,
      name: formData.name,
      gender: gender,
      birthDate: birthDate,
      leagueId: formData.leagueId,
      teamId: formData.teamId,
      personalInfoAgreement: formData.personalInfoAgreement === "y" ? "y" : "n",
      marketingAgreement: formData.marketingAgreement === "y" ? "y" : "n",
    };

    console.log("전송할 회원가입 데이터:", requestData);
    console.log(
      "리그/팀 선택 확인 - leagueId:",
      formData.leagueId,
      "teamId:",
      formData.teamId
    );

    try {
      const response = await execute("/api/v1/member/regist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      console.log("회원가입 API 응답:", response);

      if (typeof response !== "string" && response.statusCode === "FO-200") {
        // 회원가입 성공
        setShowSuccessDialog(true);
      } else {
        // 회원가입 실패 - 서버에서 반환한 오류 메시지 표시
        const errorMsg =
          typeof response !== "string" && response.data
            ? (response.data as string)
            : "회원가입에 실패했습니다. 다시 시도해주세요.";
        setErrorMessage(errorMsg);
        setShowErrorDialog(true);
      }
    } catch (error) {
      console.error("회원가입 API 오류:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* 메인 컨텐츠 */}
      <div className="max-w-4xl mx-auto pt-8 pb-8 px-4">
        {/* 제목 */}
        <div className="text-center mb-12">
          <Image
            src={"/assets/images/fillo_logo.png"}
            alt="Fillo Logo"
            width={100}
            height={50}
            className="mx-auto mb-6 object-contain"
          />
          <h1 className="text-4xl font-black text-gray-900 mb-4">계정 생성</h1>
          <p className="text-lg text-gray-600">
            스포츠 팬덤의 새로운 시작을 함께하세요
          </p>
        </div>

        {/* 회원가입 폼 */}
        <form className="space-y-12" onSubmit={handleSubmit}>
          {/* 첫 번째 레이아웃 그룹 - 개인정보 수집 및 이용 동의 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              개인정보 수집 및 이용 동의
            </h2>

            {/* 약관 내용 */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6 h-64 overflow-y-auto custom-scrollbar">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                개인정보 수집 및 이용 동의 약관
              </h3>
              <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                <p>
                  <strong>1. 개인정보의 수집 및 이용 목적</strong>
                </p>
                <p>- 회원 가입 및 관리, 서비스 제공 및 개선</p>
                <p>- 스포츠 팬덤 매칭 서비스 제공</p>
                <p>- 고객 상담 및 불만 처리</p>

                <p>
                  <strong>2. 수집하는 개인정보 항목</strong>
                </p>
                <p>
                  - 필수항목: 이메일, 비밀번호, 이름, 성별, 생년월일, 주소,
                  주민번호 앞자리, 응원팀 정보
                </p>
                <p>- 선택항목: 마케팅 정보 수신 동의</p>

                <p>
                  <strong>3. 개인정보의 보유 및 이용 기간</strong>
                </p>
                <p>- 회원 탈퇴 시까지 (단, 관계 법령에 따라 일정 기간 보관)</p>

                <p>
                  <strong>4. 개인정보 제공 거부 권리</strong>
                </p>
                <p>
                  - 필수항목 수집에 대한 동의 거부 시 서비스 이용이 제한될 수
                  있습니다.
                </p>
              </div>
            </div>

            {/* 동의 체크박스 */}
            <div className="space-y-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    formData.personalInfoAgreement === "y" ? true : false
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "personalInfoAgreement",
                      e.target.checked ? "y" : "n"
                    )
                  }
                  className="w-5 h-5 mt-1 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-lg font-medium text-gray-900">
                  개인정보 수집 및 이용 동의{" "}
                  <span className="text-red-500">[필수]</span>
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-red-500 text-sm ml-8">{errors.agreeTerms}</p>
              )}

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.marketingAgreement === "y" ? true : false}
                  onChange={(e) =>
                    handleInputChange(
                      "marketingAgreement",
                      e.target.checked ? "y" : "n"
                    )
                  }
                  className="w-5 h-5 mt-1 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-lg font-medium text-gray-900">
                  마케팅 및 카카오톡 알림 메시지 수신 동의{" "}
                  <span className="text-gray-500">[선택]</span>
                </span>
              </label>
            </div>
          </div>

          {/* 두 번째 레이아웃 그룹 - 이메일 및 비밀번호 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">계정 정보</h2>

            <div className="space-y-6">
              {/* 이메일 주소 입력 */}
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">
                  이메일 주소
                </label>
                <div className="flex space-x-3">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="name@example.com"
                    className="flex-1 px-4 py-3 border border-purple-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleEmailVerification}
                    className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    이메일 인증
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  로그인에 사용될 이메일 주소를 입력하세요.
                </p>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* 인증번호 입력 */}
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">
                  인증번호
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={formData.emailVerificationCode}
                    onChange={(e) =>
                      handleInputChange("emailVerificationCode", e.target.value)
                    }
                    placeholder="인증번호 6자리 입력"
                    className="flex-1 px-4 py-3 border border-purple-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleVerificationCodeCheck}
                    disabled={!isTimerActive || !authCode}
                    className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    인증번호 확인
                  </button>
                </div>
                {/* 타이머 표시 */}
                {isTimerActive && (
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-purple-600 font-medium">
                        남은 시간: {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                )}
                <p className="text-sm text-gray-600">
                  이메일로 전송된 인증번호를 입력하세요.
                </p>
                {errors.emailVerificationCode && (
                  <p className="text-red-500 text-sm">
                    {errors.emailVerificationCode}
                  </p>
                )}
              </div>

              {/* 비밀번호 입력 */}
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">
                  비밀번호
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    placeholder="비밀번호"
                    className="w-full px-4 py-3 pr-12 border border-purple-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  영문, 숫자, 특수문자 포함 8~20자까지 입력하세요.
                </p>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>

              {/* 비밀번호 재입력 */}
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <input
                    type={showPasswordConfirm ? "text" : "password"}
                    value={formData.checkPassword}
                    onChange={(e) =>
                      handleInputChange("checkPassword", e.target.value)
                    }
                    placeholder="비밀번호 재입력"
                    className="w-full px-4 py-3 pr-12 border border-purple-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPasswordConfirm ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.passwordConfirm && (
                  <p className="text-red-500 text-sm">
                    {errors.passwordConfirm}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 세 번째 레이아웃 그룹 - 개인정보 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">개인정보</h2>

            <div className="space-y-6">
              {/* 이름 입력 */}
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">
                  이름
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="이름을 입력하세요"
                  className="w-full px-4 py-3 border border-purple-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              {/* 성별 설정 */}
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">
                  성별
                </label>
                <div className="flex space-x-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === "male"}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-lg text-gray-700">남성</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === "female"}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-lg text-gray-700">여성</span>
                  </label>
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-sm">{errors.gender}</p>
                )}
              </div>

              {/* 생년월일 */}
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">
                  생년월일
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    value={formData.birthYear}
                    onChange={(e) =>
                      handleInputChange(
                        "birthYear",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="px-4 py-3 border border-purple-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                  <select
                    value={formData.birthMonth}
                    onChange={(e) =>
                      handleInputChange(
                        "birthMonth",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="px-4 py-3 border border-purple-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                  <select
                    value={formData.birthDay}
                    onChange={(e) =>
                      handleInputChange(
                        "birthDay",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="px-4 py-3 border border-purple-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">일</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.birth && (
                  <p className="text-red-500 text-sm">{errors.birth}</p>
                )}
              </div>

              {/* 주소 */}
              {/* <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">
                  주소
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="주소를 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address}</p>
                )}
              </div> */}

              {/* 주민번호 */}
              {/* <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700">
                  주민번호 앞자리
                </label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) =>
                    handleInputChange("idNumber", e.target.value)
                  }
                  placeholder="생년월일 6자리 (예: 951015)"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.idNumber && (
                  <p className="text-red-500 text-sm">{errors.idNumber}</p>
                )}
              </div> */}
            </div>
          </div>

          {/* 네 번째 레이아웃 그룹 - 응원 리그 및 팀 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              응원 팀 설정
            </h2>

            <div className="space-y-8">
              {/* 응원 리그 선택 */}
              <div className="space-y-4">
                <label className="block text-lg font-medium text-gray-700">
                  응원 리그
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
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
                            <div className="mb-10 w-24 h-24 rounded-lg overflow-hidden bg-gray-50 mb-3 transition-all duration-200 group-hover:bg-purple-50 group-hover:shadow-lg">
                              <Image
                                src={getLeagueImage(league.leagueName)}
                                alt={league.leagueName}
                                width={96}
                                height={96}
                                className="w-full h-full object-contain p-2"
                              />
                            </div>
                            <input
                              type="radio"
                              name="selectedLeague"
                              value={league.leagueId}
                              checked={formData.leagueId === league.leagueId}
                              onChange={(e) =>
                                handleInputChange(
                                  "leagueId",
                                  parseInt(e.target.value)
                                )
                              }
                              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-6 text-purple-600 focus:ring-purple-500 focus:ring-2 checked:bg-purple-600 checked:border-purple-600"
                              style={{
                                accentColor: "#9400ea",
                              }}
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
                {errors.selectedLeague && (
                  <p className="text-red-500 text-sm">
                    {errors.selectedLeague}
                  </p>
                )}
              </div>

              {/* 응원 팀 선택 */}
              {teams.length > 0 && (
                <div className="space-y-4">
                  <label className="block text-lg font-medium text-gray-700">
                    응원 팀
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                    {teams.map((team: Team) => {
                      const getTeamImage = (
                        teamName: string,
                        leagueId: number
                      ) => {
                        // 리그별 팀 이미지 매핑
                        const teamImageMap: Record<
                          number,
                          Record<string, string>
                        > = {
                          1: {
                            // 프리미어리그
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
                            // 라리가
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
                            // 분데스리가
                            "바이에른 뮌헨":
                              "/assets/images/bundesliga/bayernmunchen.png",
                            도르트문트:
                              "/assets/images/bundesliga/dortmund.png",
                            레버쿠젠:
                              "/assets/images/bundesliga/leverkusen.png",
                          },
                          4: {
                            // 세리에A
                            인터밀란: "/assets/images/serie/intermilan.png",
                            AC밀란: "/assets/images/serie/acmilan.png",
                            유벤투스: "/assets/images/serie/juventus.png",
                            아탈란타: "/assets/images/serie/atalanta.png",
                            AS로마: "/assets/images/serie/asroma.png",
                          },
                          5: {
                            // 리그앙
                            PSG: "/assets/images/league1/psg.png",
                            리옹: "/assets/images/league1/lyon.png",
                            마르세유: "/assets/images/league1/marseille.png",
                            AS모나코: "/assets/images/league1/asmonaco.png",
                            릴: "/assets/images/league1/lill.png",
                          },
                        };

                        // "없음" 팀인 경우 특별한 아이콘 사용
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
                            <div className="mb-10 w-20 h-20 rounded-lg overflow-hidden bg-gray-50 mb-2 transition-all duration-200 group-hover:bg-purple-50 group-hover:shadow-md">
                              <Image
                                src={getTeamImage(
                                  team.teamName,
                                  formData.leagueId
                                )}
                                alt={team.teamName}
                                width={80}
                                height={80}
                                className="w-full h-full object-contain p-1"
                              />
                            </div>
                            <input
                              type="radio"
                              name="selectedTeam"
                              value={team.teamId}
                              checked={formData.teamId === team.teamId}
                              onChange={(e) =>
                                handleInputChange(
                                  "teamId",
                                  parseInt(e.target.value)
                                )
                              }
                              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-5 text-purple-600 focus:ring-purple-500 focus:ring-2 checked:bg-purple-600 checked:border-purple-600"
                              style={{
                                accentColor: "#9400ea",
                              }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700 text-center group-hover:text-purple-600 transition-colors leading-tight px-1">
                            {team.teamName}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.selectedTeam && (
                    <p className="text-red-500 text-sm">
                      {errors.selectedTeam}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 계정 생성 버튼 */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl font-semibold rounded-2xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all transform hover:scale-[1.02] shadow-lg"
          >
            계정 생성하기
          </button>
        </form>

        {/* 로그인 페이지 링크 */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            이미 계정이 있으신가요?{" "}
            <Link
              href="/auth/login"
              className="text-purple-600 font-medium hover:text-purple-700"
            >
              로그인하기
            </Link>
          </p>
        </div>
      </div>

      {/* 타임아웃 알림 다이얼로그 */}
      {showTimeoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                인증 시간 만료
              </h3>
              <p className="text-gray-600 mb-6">
                인증번호 입력 시간이 만료되었습니다.
                <br />
                다시 이메일 인증을 받아주세요.
              </p>
              <button
                onClick={() => setShowTimeoutDialog(false)}
                className="w-full py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 회원가입 성공 다이얼로그 */}
      {showSuccessDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                계정 생성 완료
              </h3>
              <p className="text-gray-600 mb-6">
                회원가입이 성공적으로 완료되었습니다.
                <br />
                로그인 페이지로 이동합니다.
              </p>
              <button
                onClick={() => {
                  setShowSuccessDialog(false);
                  window.location.href = "/auth/login";
                }}
                className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                로그인 페이지로 이동
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 회원가입 오류 다이얼로그 */}
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

export default SignupPage;
