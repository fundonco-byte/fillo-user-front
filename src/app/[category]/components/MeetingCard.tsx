"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, MapPin, Clock, Users, Star } from "lucide-react";
import { MeetingData } from "../types";

// 모임 카드 컴포넌트
export function MeetingCard({ meeting }: { meeting: MeetingData }) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(meeting.isLiked);

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleCardClick = () => {
    router.push(`/meetings/${meeting.id}`);
  };

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/meetings/${meeting.id}`);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-sm cursor-pointer group overflow-hidden border border-gray-100 card-hover"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative">
        <div className="aspect-[4/3] gradient-bg-light flex items-center justify-center text-5xl relative group-hover:scale-105 transition-transform duration-300">
          {meeting.image}

          {/* Like Button */}
          <button
            onClick={handleLikeToggle}
            className="absolute top-3 right-3 w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm"
          >
            <Heart
              className={`w-4 h-4 ${
                isLiked
                  ? "text-red-500 fill-red-500"
                  : "text-gray-400 hover:text-red-500"
              } transition-colors`}
            />
          </button>

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-block bg-white/95 backdrop-blur-sm text-purple-600 text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm">
              {meeting.category}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
          {meeting.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {meeting.description}
        </p>

        {/* Meta Information */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-2 text-purple-500" />
            <span>
              {meeting.date} {meeting.time}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-2 text-green-500" />
            <span className="line-clamp-1">{meeting.location}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between mb-4 py-2 px-3 bg-gray-50 rounded-lg">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="w-4 h-4 mr-2 text-purple-500" />
            <span className="font-medium">
              {meeting.participants}/{meeting.maxParticipants}명
            </span>
          </div>
          <div className="text-sm font-bold text-purple-600">
            {meeting.price}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {meeting.tags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-purple-50 text-purple-600 text-xs px-2.5 py-1 rounded-full font-medium"
            >
              #{tag}
            </span>
          ))}
          {meeting.tags.length > 2 && (
            <span className="inline-block bg-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-full font-medium">
              +{meeting.tags.length - 2}
            </span>
          )}
        </div>

        {/* Organizer */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-xs text-gray-500">
            <Star className="w-3 h-3 mr-1 text-yellow-400" />
            <span>주최: {meeting.organizer}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleJoinClick}
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          자세히 보기
        </button>
      </div>
    </div>
  );
}
