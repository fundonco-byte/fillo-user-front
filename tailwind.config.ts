import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Fundon 브랜드 색상 시스템 (Figma 디자인 가이드 기반)
        brand: {
          primary: "#9400ea", // 메인 보라색
          "primary-dark": "#7e00c6", // 짙은 보라색
          "primary-light": "#d9b6f6", // 밝은 보라색
          secondary: "#5f0095", // 보조 보라색
          accent: "#00c2a8", // 하이라이트 터키석
        },
        purple: {
          50: "#faf5ff",
          100: "#f3e6fc", // Figma purple-100
          200: "#d9b6f6", // Figma purple-200
          300: "#9400ea", // Figma purple-300(main)
          400: "#7e00c6", // Figma purple-400
          500: "#5f0095", // Figma purple-500
          600: "#9400ea", // 브랜드 메인 색상
          700: "#7e00c6", // 브랜드 다크 색상
          800: "#5f0095",
          900: "#581c87",
          950: "#3b0764",
        },
        gray: {
          50: "#fafafa", // Figma gray-50
          100: "#f5f5f5", // Figma gray-100
          300: "#dddddd", // Figma gray-300
          400: "#bababa", // Figma gray-400
          500: "#999999", // Figma gray-500
          700: "#555555", // Figma gray-700
          900: "#1a1a1a", // Figma gray-900 (Text)
        },
        accent: {
          teal: "#00c2a8", // Highlight color
          error: "#e82239", // Error Red
          success: "#3461f5", // Success Blue
          info: "#15c544", // Info Green
          warning: "#f9c416", // Warning Yellow
        },
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "sans-serif",
        ],
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #9400ea 0%, #d9b6f6 50%, #5f0095 100%)",
        "gradient-brand-light":
          "linear-gradient(135deg, #f3e6fc 0%, #d9b6f6 50%, #f3e6fc 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
