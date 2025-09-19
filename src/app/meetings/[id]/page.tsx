"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Heart,
  MapPin,
  Clock,
  Users,
  Star,
  Share2,
  Calendar,
  Shield,
  CheckCircle,
  User,
  ArrowLeft,
  MessageCircle,
  Award,
} from "lucide-react";
import { MeetingData, ReviewData } from "../../[category]/types";

// 목업 데이터
const getMockMeetingData = (id: string): MeetingData => ({
  id,
  title: "EPL 맨체스터 유나이티드 vs 맨체스터 시티 더비 관람",
  description: "맨체스터 더비를 함께 관람하며 응원해요! 맨유팬들 모여라!",
  detailedDescription: `맨체스터 더비는 EPL 최고의 라이벌 매치 중 하나입니다. 
함께 경기를 보며 열정적으로 응원하고, 경기 후에는 맛있는 음식과 함께 경기 후기를 나누어요. 
축구를 사랑하는 모든 분들이 환영합니다!

📍 장소: 홍대 스포츠바 'The RED'
🕐 시간: 오후 10시 킥오프 (9시 30분부터 입장)
💰 비용: 음료 1잔 + 안주 1개 포함

경기 전 선수 라인업 예측, 경기 중 실시간 응원, 경기 후 분석까지!
맨유의 영광을 함께 만들어갑시다! GGMU! 🔴`,
  image: "⚽",
  category: "축구",
  date: "2024년 1월 20일",
  time: "21:30",
  location: "홍대 스포츠바 'The RED'",
  participants: 8,
  maxParticipants: 12,
  price: "20,000원",
  isLiked: false,
  tags: ["EPL", "맨유", "더비", "스포츠바", "응원"],
  organizer: "맨유매니아",
  rules: [
    "상대팀을 존중하는 매너있는 응원",
    "과도한 음주 금지",
    "지각 시 연락 필수",
    "노쇼 시 다음 모임 참여 제한",
  ],
  requirements: [
    "축구에 관심이 있는 분",
    "매너 있는 응원 가능한 분",
    "모임 시간 준수 가능한 분",
  ],
  agenda: [
    "21:00 - 모임 장소 도착 및 인사",
    "21:30 - 경기 시작, 응원 시작",
    "22:15 - 하프타임 경기 분석 & 간식",
    "23:30 - 경기 종료 후 후기 및 마무리",
  ],
  organizerProfile: {
    name: "맨유매니아",
    rating: 4.8,
    totalMeetings: 47,
    joinDate: "2023.03",
    profileImage: "👨‍💼",
  },
  reviews: [
    {
      id: "1",
      userName: "축구사랑",
      userImage: "👨",
      rating: 5,
      comment: "정말 재미있는 모임이었어요! 함께 응원하니까 더 재밌네요",
      date: "2024.01.15",
    },
    {
      id: "2",
      userName: "레드데빌스",
      userImage: "👩",
      rating: 4,
      comment: "주최자분이 너무 친절하시고 분위기가 좋았습니다",
      date: "2024.01.10",
    },
  ],
});

const MeetingDetailPage = () => {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState<MeetingData | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [loginCheck, setLoginCheck] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");

  useEffect(() => {
    if (params!.id) {
      const meetingData = getMockMeetingData(params!.id as string);
      setMeeting(meetingData);
      setIsLiked(meetingData.isLiked);
    }

    if (status === "authenticated") {
      setLoginCheck(true);
    }
  }, [params!.id, session, status]);

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: meeting?.title,
        text: meeting?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다!");
    }
  };

  const handleJoinMeeting = () => {
    alert("모임 참여 신청이 완료되었습니다!");
  };

  if (!meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">모임 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 헤더 */}
      {/* <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              뒤로가기
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLikeToggle}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart
                  className={`h-5 w-5 ${
                    isLiked
                      ? "text-red-500 fill-red-500"
                      : "text-gray-400 hover:text-red-500"
                  } transition-colors`}
                />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 모임 이미지 및 기본 정보 */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[16/9] bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center text-8xl relative">
                {meeting.image}
                <div className="absolute top-4 left-4">
                  <span className="inline-block bg-white/95 backdrop-blur-sm text-purple-600 px-3 py-1.5 rounded-full font-semibold text-sm shadow-sm">
                    {meeting.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {meeting.title}
                </h1>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 mr-3 text-purple-500" />
                    <span>
                      {meeting.date} {meeting.time}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 mr-3 text-purple-400" />
                    <span>{meeting.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-3 text-purple-600" />
                    <span>
                      {meeting.participants}/{meeting.maxParticipants}명 참여
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Star className="h-5 w-5 mr-3 text-yellow-500" />
                    <span className="font-semibold text-purple-600">
                      {meeting.price}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {/* 태그 */}
                  <div className="flex flex-wrap gap-2">
                    {meeting.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block bg-purple-50 text-purple-600 text-sm px-3 py-1 rounded-full font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* 좋아요, 공유 */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleLikeToggle}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          isLiked
                            ? "text-red-500 fill-red-500"
                            : "text-gray-400 hover:text-red-500"
                        } transition-colors`}
                      />
                    </button>
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <Share2 className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 탭 네비게이션 */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("details")}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                      activeTab === "details"
                        ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    모임 상세
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                      activeTab === "reviews"
                        ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    후기 ({meeting.reviews?.length || 0})
                  </button>
                </div>
              </div>

              <div className="p-6">
                {activeTab === "details" ? (
                  <div className="space-y-6">
                    {/* 상세 설명 */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        모임 소개
                      </h3>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {meeting.detailedDescription}
                        </p>
                      </div>
                    </div>

                    {/* 진행 일정 */}
                    {meeting.agenda && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-purple-500" />
                          진행 일정
                        </h3>
                        <div className="space-y-3">
                          {meeting.agenda.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-start bg-gray-50 rounded-lg p-3"
                            >
                              <CheckCircle className="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 모임 규칙 */}
                    {meeting.rules && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-purple-600" />
                          모임 규칙
                        </h3>
                        <div className="space-y-2">
                          {meeting.rules.map((rule, index) => (
                            <div
                              key={index}
                              className="flex items-start text-gray-700"
                            >
                              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                              {rule}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 참여 조건 */}
                    {meeting.requirements && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-purple-600" />
                          참여 조건
                        </h3>
                        <div className="space-y-2">
                          {meeting.requirements.map((req, index) => (
                            <div
                              key={index}
                              className="flex items-start text-gray-700"
                            >
                              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                              {req}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {meeting.reviews && meeting.reviews.length > 0 ? (
                      meeting.reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full flex items-center justify-center text-lg mr-3">
                                {review.userImage}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">
                                  {review.userName}
                                </h4>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                  <span className="text-sm text-gray-500 ml-2">
                                    {review.date}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>아직 후기가 없습니다.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* 사이드바 */}
          <div className="space-y-6">
            {/* 참여하기 카드 */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm p-6 sticky top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {meeting.price}
                </div>
                <div className="text-sm text-gray-600">
                  현재 {meeting.participants}명이 참여 중
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (meeting.participants / meeting.maxParticipants) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {loginCheck ? (
                <button
                  onClick={handleJoinMeeting}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-sm hover:shadow-md mb-4"
                >
                  모임 참여하기
                </button>
              ) : (
                <button className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white-200 py-4 rounded-xl font-semibold shadow-sm mb-4">
                  모임 참여하기
                </button>
              )}

              {loginCheck ? (
                <div className="text-xs text-gray-500 text-center">
                  참여 신청 후 주최자 승인이 필요합니다
                </div>
              ) : (
                <div className="text-xs text-gray-500 text-center">
                  참여를 위해선 로그인이 필요합니다
                </div>
              )}
            </motion.div>

            {/* 주최자 정보 */}
            {meeting.organizerProfile && (
              <motion.div
                className="bg-white rounded-2xl shadow-sm p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  주최자 정보
                </h3>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-full flex items-center justify-center text-xl mr-4">
                    {meeting.organizerProfile.profileImage || "👨‍💼"}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {meeting.organizerProfile.name}
                    </h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                      {meeting.organizerProfile.rating}
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-purple-500" />총{" "}
                    {meeting.organizerProfile.totalMeetings}회 모임 주최
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-purple-400" />
                    {meeting.organizerProfile.joinDate} 가입
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingDetailPage;
