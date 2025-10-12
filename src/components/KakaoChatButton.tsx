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
    const scriptId = "kakao-sdk";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
      //   s.integrity =
      //     "sha384-eKjgk3YxvG8qKX2SkcI+4P1yqJQd1orEw1xj8KpS8m8qf3TgVbJtK0dT7P7Q9+6B";
      s.crossOrigin = "anonymous";
      s.onload = () => {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
        }

        window.Kakao.Channel.createChatButton({
          container: containerRef.current,
          channelPublicId: process.env.NEXT_PUBLIC_KAKAO_CHANNEL_ID,
          size: "small",
          color: "yellow",
          shape: "pc",
          title: "question", // "문의하기" 버튼 스타일
        });
      };
      document.body.appendChild(s);
    }
  }, []);

  return <div ref={containerRef}></div>;
}
