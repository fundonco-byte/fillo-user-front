"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Star, Trophy } from "lucide-react";

const TestimonialsSection = () => {
  const activities = [
    {
      id: 1,
      title: "FC서울 vs 강원FC 함께 보기",
      category: "축구",
      type: "액티비티",
      image: "⚽",
      date: "2024년 1월 15일",
      time: "오후 2:00",
      location: "서울월드컵경기장",
      participants: 8,
      maxParticipants: 12,
      rating: 4.8,
      price: "₩25,000",
      description:
        "열정적인 축구 팬들과 함께 FC서울의 경기를 응원하며 즐거운 시간을 보내요!",
      tags: ["K리그", "응원", "맥주", "족발"],
    },
    {
      id: 2,
      title: "두산 베어스 응원단 모집",
      category: "야구",
      type: "액티비티",
      image: "⚾",
      date: "2024년 1월 20일",
      time: "오후 6:30",
      location: "잠실야구장",
      participants: 15,
      maxParticipants: 20,
      rating: 4.9,
      price: "₩30,000",
      description:
        "두산 베어스와 함께 승리의 기쁨을 나누어요! 응원용품과 치킨까지 제공됩니다.",
      tags: ["KBO", "응원가", "치킨", "맥주"],
    },
    {
      id: 3,
      title: "NBA 플레이오프 단체관람",
      category: "농구",
      type: "액티비티",
      image: "🏀",
      date: "2024년 1월 18일",
      time: "오전 10:00",
      location: "강남 스포츠바",
      participants: 6,
      maxParticipants: 10,
      rating: 4.7,
      price: "₩15,000",
      description:
        "레이커스 vs 셀틱스! 역사적인 라이벌전을 함께 보면서 농구 이야기를 나눠요.",
      tags: ["NBA", "플레이오프", "스포츠바", "브런치"],
    },
    {
      id: 4,
      title: "테니스 윔블던 결승 시청",
      category: "테니스",
      type: "액티비티",
      image: "🎾",
      date: "2024년 1월 25일",
      time: "오후 9:00",
      location: "홍대 테니스 카페",
      participants: 4,
      maxParticipants: 8,
      rating: 4.6,
      price: "₩20,000",
      description:
        "세계 최고의 테니스 경기를 감상하며 테니스에 대한 열정을 공유해요.",
      tags: ["윔블던", "테니스", "카페", "디저트"],
    },
    {
      id: 5,
      title: "배드민턴 동호회 정기 모임",
      category: "배드민턴",
      type: "액티비티",
      image: "🏸",
      date: "2024년 1월 22일",
      time: "오후 7:00",
      location: "강남 배드민턴장",
      participants: 12,
      maxParticipants: 16,
      rating: 4.5,
      price: "₩10,000",
      description:
        "함께 배드민턴을 치며 운동과 친목을 동시에! 초보자도 환영합니다.",
      tags: ["배드민턴", "운동", "친목", "초보환영"],
    },
    {
      id: 6,
      title: "족구 토너먼트 참가팀 모집",
      category: "족구",
      type: "액티비티",
      image: "⚪",
      date: "2024년 1월 28일",
      time: "오후 2:00",
      location: "한강공원 족구장",
      participants: 8,
      maxParticipants: 12,
      rating: 4.4,
      price: "₩5,000",
      description:
        "한강에서 즐기는 족구 토너먼트! 상금도 있고 뒤풀이도 있어요.",
      tags: ["족구", "토너먼트", "한강", "뒤풀이"],
    },
    {
      id: 7,
      title: "스포츠 팬 네트워킹 파티",
      category: "네트워킹",
      type: "모임",
      image: "🎉",
      date: "2024년 1월 30일",
      time: "오후 7:00",
      location: "강남 루프탑 바",
      participants: 25,
      maxParticipants: 40,
      rating: 4.8,
      price: "₩35,000",
      description:
        "다양한 스포츠를 좋아하는 사람들과의 네트워킹! 새로운 인맥을 만들어보세요.",
      tags: ["네트워킹", "루프탑", "칵테일", "인맥"],
    },
    {
      id: 8,
      title: "스포츠 시상식 후 애프터파티",
      category: "파티",
      type: "모임",
      image: "🏆",
      date: "2024년 2월 5일",
      time: "오후 9:00",
      location: "이태원 클럽",
      participants: 18,
      maxParticipants: 30,
      rating: 4.7,
      price: "₩40,000",
      description:
        "올해의 스포츠 스타들과 함께하는 화려한 파티! 드레스코드: 세미 포멀",
      tags: ["애프터파티", "클럽", "세미포멀", "스포츠스타"],
    },
    {
      id: 9,
      title: "스포츠 박람회 단체 관람",
      category: "행사",
      type: "모임",
      image: "🎪",
      date: "2024년 2월 10일",
      time: "오전 10:00",
      location: "코엑스 전시장",
      participants: 20,
      maxParticipants: 35,
      rating: 4.6,
      price: "₩15,000",
      description:
        "최신 스포츠 용품과 기술을 한눈에! 점심 식사와 쇼핑 투어도 포함되어 있어요.",
      tags: ["박람회", "코엑스", "쇼핑투어", "점심포함"],
    },
  ];

  const stats = [
    { number: "1,200+", label: "개최된 모임" },
    { number: "96%", label: "만족도" },
    { number: "15+", label: "스포츠 종목" },
    { number: "5,000+", label: "참여 멤버" },
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <motion.div
            className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Trophy className="h-4 w-4 mr-2" />
            다가오는 모임
          </motion.div>

          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-green-600">
              액티비티 & 모임
            </span>
            에서
            <br />
            함께할 동료를 찾아보세요
          </motion.h2>

          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            축구부터 네트워킹까지, 다양한 스포츠 관련 모임에 참여하고 새로운
            친구들을 만나보세요!
          </motion.p>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* 모임 카드들 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              className="bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* 이미지 영역 */}
              <div className="relative h-48 bg-gradient-to-br from-purple-100 to-green-100 flex items-center justify-center">
                <div className="text-6xl">{activity.image}</div>
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      activity.type === "액티비티"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {activity.type}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-white px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
                    {activity.category}
                  </span>
                </div>
              </div>

              {/* 내용 영역 */}
              <div className="p-6">
                {/* 제목 */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                  {activity.title}
                </h3>

                {/* 날짜/시간/장소 */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {activity.date} {activity.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {activity.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    {activity.participants}/{activity.maxParticipants}명 참여
                  </div>
                </div>

                {/* 설명 */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {activity.description}
                </p>

                {/* 태그들 */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {activity.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 하단 정보 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-semibold text-gray-700">
                      {activity.rating}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {activity.price}
                  </div>
                </div>

                {/* 참여 버튼 */}
                <button className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-full transition-colors">
                  참여하기
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 하단 CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-purple-600 to-green-600 rounded-3xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              더 많은 모임을 찾아보세요!
            </h3>
            <p className="text-purple-100 mb-6">
              매일 새로운 스포츠 모임이 열립니다. 지금 가입하고 완벽한 매칭을
              경험해보세요.
            </p>
            <button className="bg-white text-purple-600 hover:bg-gray-50 font-semibold px-8 py-4 rounded-full transition-colors flex items-center gap-2 mx-auto">
              <Users className="h-5 w-5" />
              모든 모임 보기
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
