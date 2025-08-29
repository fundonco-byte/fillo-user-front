// app/api/auth/[...nextauth]/route.ts (App Router)
// 또는 src/auth.ts 사용 패턴
import NextAuth from "next-auth";
import Kakao from "next-auth/providers/kakao";

export default NextAuth({
  providers: [
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!, // 콘솔에서 생성/활성화
    }),
  ],
  // 필요시 callbacks로 프로필 매핑/세션 확장
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user = { ...session.user };
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
});

// export default { handler as GET, handler as POST };
