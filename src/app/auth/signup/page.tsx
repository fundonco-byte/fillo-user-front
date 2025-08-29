"use client";

import { useState } from "react";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import filloLogo from "@/assets/images/fillo_logo.png";

interface FormData {
  email: string;
  emailVerificationCode: string;
  password: string;
  passwordConfirm: string;
  name: string;
  gender: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  address: string;
  idNumber: string;
  selectedLeague: string;
  selectedTeam: string;
  agreeTerms: boolean;
  agreeMarketing: boolean;
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
const leagueTeams = {
  프리미어리그: [
    "아스날",
    "첼시",
    "맨시티",
    "맨유",
    "리버풀",
    "토트넘",
    "뉴캐슬",
  ],
  라리가: [
    "바르셀로나",
    "레알 마드리드",
    "아틀레티코 마드리드",
    "비야레알",
    "발렌시아",
    "레알 베티스",
    "아틀레틱 빌바오",
  ],
  분데스리가: ["바이에른 뮌헨", "도르트문트", "레버쿠젠"],
  세리에A: ["인터밀란", "AC밀란", "유벤투스", "아탈란타", "AS로마"],
  리그앙: ["PSG", "리옹", "마르세유"],
  없음: ["없음"],
};

const SignupPage = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    emailVerificationCode: "",
    password: "",
    passwordConfirm: "",
    name: "",
    gender: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    address: "",
    idNumber: "",
    selectedLeague: "",
    selectedTeam: "",
    agreeTerms: false,
    agreeMarketing: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showTerms, setShowTerms] = useState(false);

  const leagues = Object.keys(leagueTeams);

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // 리그 변경 시 팀 초기화
    if (field === "selectedLeague") {
      setFormData((prev) => ({
        ...prev,
        selectedLeague: value as string,
        selectedTeam: "",
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

  const getAvailableTeams = () => {
    if (!formData.selectedLeague) return [];
    return (
      leagueTeams[formData.selectedLeague as keyof typeof leagueTeams] || []
    );
  };

  const handleEmailVerification = () => {
    // 이메일 인증 로직
    console.log("이메일 인증 요청:", formData.email);
    // 실제로는 API 호출
    setIsEmailVerified(true);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

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
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = "비밀번호를 다시 입력해주세요.";
    } else if (formData.password !== formData.passwordConfirm) {
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
      newErrors.birth = "생년월일을 입력해주세요.";
    }

    // 주소 검증
    if (!formData.address) {
      newErrors.address = "주소를 입력해주세요.";
    }

    // 주민번호 검증
    if (!formData.idNumber) {
      newErrors.idNumber = "주민번호를 입력해주세요.";
    }

    // 응원 리그 검증
    if (!formData.selectedLeague) {
      newErrors.selectedLeague = "응원 리그를 선택해주세요.";
    }

    // 응원팀 검증
    if (!formData.selectedTeam) {
      newErrors.selectedTeam = "응원팀을 선택해주세요.";
    }

    // 필수 동의 항목 검증
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "개인정보 수집 및 이용 동의는 필수입니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert(
        "마케팅 및 카카오톡 알림 메시지 수신 동의를 제외한 나머지 정보를 모두 입력해주세요."
      );
      return;
    }

    // 회원가입 로직
    console.log("회원가입 데이터:", formData);
    alert("회원가입이 완료되었습니다!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* 메인 컨텐츠 */}
      <div className="max-w-4xl mx-auto pt-8 pb-8 px-4">
        {/* 제목 */}
        <div className="text-center mb-12">
          <Image
            src={filloLogo}
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
                  checked={formData.agreeTerms}
                  onChange={(e) =>
                    handleInputChange("agreeTerms", e.target.checked)
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
                  checked={formData.agreeMarketing}
                  onChange={(e) =>
                    handleInputChange("agreeMarketing", e.target.checked)
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                <input
                  type="text"
                  value={formData.emailVerificationCode}
                  onChange={(e) =>
                    handleInputChange("emailVerificationCode", e.target.value)
                  }
                  placeholder="인증번호 6자리 입력"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
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
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    value={formData.passwordConfirm}
                    onChange={(e) =>
                      handleInputChange("passwordConfirm", e.target.value)
                    }
                    placeholder="비밀번호 재입력"
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      handleInputChange("birthYear", e.target.value)
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      handleInputChange("birthMonth", e.target.value)
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      handleInputChange("birthDay", e.target.value)
                    }
                    className="px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
              <div className="space-y-2">
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
              </div>

              {/* 주민번호 */}
              <div className="space-y-2">
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
              </div>
            </div>
          </div>

          {/* 네 번째 레이아웃 그룹 - 응원 리그 및 팀 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-purple-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              응원 팀 설정
            </h2>

            <div className="space-y-6">
              {/* 응원 리그 선택 */}
              <div className="space-y-3">
                <label className="block text-lg font-medium text-gray-700">
                  응원 리그
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {leagues.map((league) => (
                    <label
                      key={league}
                      className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="selectedLeague"
                        value={league}
                        checked={formData.selectedLeague === league}
                        onChange={(e) =>
                          handleInputChange("selectedLeague", e.target.value)
                        }
                        className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {league}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.selectedLeague && (
                  <p className="text-red-500 text-sm">
                    {errors.selectedLeague}
                  </p>
                )}
              </div>

              {/* 응원 팀 선택 */}
              {formData.selectedLeague && (
                <div className="space-y-3">
                  <label className="block text-lg font-medium text-gray-700">
                    응원 팀
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {getAvailableTeams().map((team) => (
                      <label
                        key={team}
                        className="flex items-center space-x-2 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-purple-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name="selectedTeam"
                          value={team}
                          checked={formData.selectedTeam === team}
                          onChange={(e) =>
                            handleInputChange("selectedTeam", e.target.value)
                          }
                          className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {team}
                        </span>
                      </label>
                    ))}
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
    </div>
  );
};

export default SignupPage;
