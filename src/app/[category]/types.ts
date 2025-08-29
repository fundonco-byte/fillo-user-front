// 모임 데이터 타입 정의
export interface MeetingData {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants: number;
  price: string;
  isLiked: boolean;
  tags: string[];
  organizer: string;
  // 상세 페이지용 추가 필드들
  detailedDescription?: string;
  rules?: string[];
  requirements?: string[];
  agenda?: string[];
  organizerProfile?: {
    name: string;
    rating: number;
    totalMeetings: number;
    joinDate: string;
    profileImage?: string;
  };
  reviews?: ReviewData[];
  relatedMeetings?: MeetingData[];
}

// 리뷰 데이터 타입
export interface ReviewData {
  id: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
}
