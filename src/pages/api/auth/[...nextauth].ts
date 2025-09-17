// app/api/auth/[...nextauth]/route.ts (App Router)
// 또는 src/auth.ts 사용 패턴
import NextAuth from "next-auth";
import Kakao from "next-auth/providers/kakao";
import Credentials from "next-auth/providers/credentials";
import { loginApi } from "@/lib/api";

export default NextAuth({
  providers: [
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!, // 콘솔에서 생성/활성화
    }),
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { response, tokens } = await loginApi({
            email: credentials.email,
            password: credentials.password,
          });

          if (response.statusCode === "FO-200") {
            // 성공 시 사용자 정보와 토큰을 반환
            return {
              id: response.data?.id || credentials.email,
              email: credentials.email,
              name: response.data?.name || "",
              accessToken: tokens.authorization,
              refreshToken: tokens.refreshToken,
            };
          }

          return null;
        } catch (error) {
          console.error("Login API error:", error);
          return null;
        }
      },
    }),
  ],
  // 필요시 callbacks로 프로필 매핑/세션 확장
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.provider = account.provider;

        // Credentials 로그인 시 토큰 정보 저장
        if (account.provider === "credentials" && user) {
          token.accessToken = (user as any).accessToken;
          token.refreshToken = (user as any).refreshToken;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // 세션에 토큰 정보 포함
      session.user = {
        ...session.user,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string,
      };
      return session;
    },
  },
  session: {
    strategy: "jwt",
    // maxAge: 60 * 60 * 24 * 1, // ← 1일 (초 단위)
    // updateAge: 60 * 60 * 24, // ← 1일마다 사용자 활동 시 만료를 연장
    maxAge: 86400, // 1일
    updateAge: 86400, // 1일
  },
  jwt: {
    // maxAge: 60 * 60 * 24 * 1, // ← JWT 자체 만료를 1일로 맞춤
    maxAge: 86400, // 1일
  },
  pages: {
    signIn: "/auth/login", // 커스텀 로그인 페이지
    error: "/auth/login", // 에러 시 로그인 페이지로 리다이렉트
  },
});

// export default { handler as GET, handler as POST };
