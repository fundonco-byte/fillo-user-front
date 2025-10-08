"use client";

const Footer = () => {
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
              <p>주소: 서울특별시 000구 000로 123</p>
              <p>연락처: 010-xxxx-xxxx</p>
              <p>e-mail: example@.com</p>
              <p>카카오 문의:</p>
            </div>

            {/* 소셜 미디어 아이콘 */}
            <div className="flex space-x-2 mt-4">
              <div className="w-10 h-10 bg-[#f0f0f0] border border-[#e4e4e4] rounded-full flex items-center justify-center">
                {/* Instagram */}
              </div>
              <div className="w-10 h-10 bg-[#f0f0f0] border border-[#e4e4e4] rounded-full flex items-center justify-center">
                {/* YouTube */}
              </div>
              <div className="w-10 h-10 bg-[#f0f0f0] border border-[#e4e4e4] rounded-full flex items-center justify-center">
                {/* Naver Blog */}
              </div>
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
