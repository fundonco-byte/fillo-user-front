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
        // 브랜드 보라색 색상 시스템 (로고와 일치)
        brand: {
          primary: "#9400ea", // 메인 보라색
          "primary-dark": "#7c3aed", // 짙은 보라색
          "primary-light": "#a855f7", // 밝은 보라색
          secondary: "#8b5cf6", // 보조 보라색
          accent: "#ec4899", // 포인트 핑크색
        },
        purple: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7", // 기본 보라색
          600: "#9400ea", // 브랜드 메인 색상
          700: "#7c3aed", // 브랜드 다크 색상
          800: "#6b21a8",
          900: "#581c87",
          950: "#3b0764",
        },
      },
      backgroundImage: {
        "gradient-brand":
          "linear-gradient(135deg, #9400ea 0%, #a855f7 50%, #8b5cf6 100%)",
        "gradient-brand-light":
          "linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 50%, #ddd6fe 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
