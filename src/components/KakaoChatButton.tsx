"use client";

import { useEffect, useRef } from "react";

interface KakaoChannel {
  createChatButton: (options: {
    container: HTMLElement | null;
    channelPublicId: string | undefined;
    size: string;
    color: string;
    shape: string;
    title: string;
  }) => void;
}

interface KakaoSDK {
  isInitialized: () => boolean;
  init: (key: string | undefined) => void;
  Channel: KakaoChannel;
}

declare global {
  interface Window {
    Kakao: KakaoSDK;
  }
}

export default function KakaoChatButton() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeChatButton = () => {
      if (!containerRef.current) return;

      // 기존 버튼이 있다면 제거 (중복 방지)
      containerRef.current.innerHTML = "";

      // Kakao SDK가 초기화되어 있는지 확인
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
      }

      // 채팅 버튼 생성
      if (window.Kakao && window.Kakao.Channel) {
        window.Kakao.Channel.createChatButton({
          container: containerRef.current,
          channelPublicId: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_ID,
          size: "small",
          color: "yellow",
          shape: "pc",
          title: "question", // "문의하기" 버튼 스타일
        });
      }
    };

    const scriptId = "kakao-sdk";
    const existingScript = document.getElementById(scriptId);

    if (existingScript) {
      // 스크립트가 이미 로드되어 있으면 바로 버튼 생성
      initializeChatButton();
    } else {
      // 스크립트가 없으면 새로 로드
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
      s.crossOrigin = "anonymous";
      s.onload = () => {
        initializeChatButton();
      };
      document.body.appendChild(s);
    }

    // 클린업: 컴포넌트 언마운트 시 컨테이너 내용 비우기
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return <div ref={containerRef}></div>;
}
