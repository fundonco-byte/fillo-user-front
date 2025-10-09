"use client";

import { ExternalLink } from "lucide-react";

const Footer = () => {
  const handleSocialClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <footer className="bg-[#fafafa] border-t border-[#dddddd]">
      <div className="max-w-screen-xl mx-auto px-5 py-8">
        <div className="flex justify-between items-start">
          {/* 왼쪽: 로고와 회사 정보 */}
          <div className="flex flex-col">
            <h2 className="text-[#1a1a1a] text-xl font-semibold mb-4">
              Fundon
            </h2>
            <div className="text-[#999999] text-xs leading-relaxed space-y-1">
              <p>대표자명: 박결</p>
              <p>주소: 서울시 종로구 대학로5길 20-2</p>
              <p>연락처: 010-3489-7828</p>
              <p>e-mail: xxcc9876@naver.com</p>
              {/* <p>카카오 문의:</p> */}
            </div>

            {/* 소셜 미디어 아이콘 */}
            <div className="flex space-x-2 mt-4">
              {/* Instagram */}
              <button
                onClick={() =>
                  handleSocialClick(
                    "https://www.instagram.com/fundon_official/"
                  )
                }
                className="w-10 h-10 bg-[#f0f0f0] border border-[#e4e4e4] rounded-full flex items-center justify-center hover:bg-[#E4405F] hover:border-[#E4405F] transition-all duration-200 group"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5 text-[#666666] group-hover:text-white transition-colors duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>

              {/* YouTube */}
              <button
                onClick={() =>
                  handleSocialClick("https://www.youtube.com/@Fundon4824")
                }
                className="w-10 h-10 bg-[#f0f0f0] border border-[#e4e4e4] rounded-full flex items-center justify-center hover:bg-[#FF0000] hover:border-[#FF0000] transition-all duration-200 group"
                aria-label="YouTube"
              >
                <svg
                  className="w-5 h-5 text-[#666666] group-hover:text-white transition-colors duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </button>

              {/* Notion */}
              <button
                onClick={() =>
                  handleSocialClick(
                    "https://www.notion.so/fundon-playus/Welcome-to-Fundon-9e00b7af274840528d9d08971011d331"
                  )
                }
                className="w-10 h-10 bg-[#f0f0f0] border border-[#e4e4e4] rounded-full flex items-center justify-center hover:bg-[#000000] hover:border-[#000000] transition-all duration-200 group"
                aria-label="Notion"
              >
                <svg
                  className="w-5 h-5 text-[#666666] group-hover:text-white transition-colors duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.864-.98c1.635-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.747.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.68-1.632z" />
                </svg>
              </button>
            </div>
          </div>

          {/* 오른쪽: 링크들과 저작권 */}
          <div className="flex flex-col items-end">
            <div className="flex space-x-8 mb-4">
              <button className="text-[#555555] text-base font-semibold hover:text-[#1a1a1a] transition-colors">
                이용안내
              </button>
              <button className="text-[#555555] text-base font-semibold hover:text-[#1a1a1a] transition-colors">
                개인정보처리방침
              </button>
            </div>
            <p className="text-[#999999] text-[15px]">
              © Fundon. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
