export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  statusMessage: string;
  statusCode: string;
  data: T;
}

export interface AuthTokens {
  authorization?: string;
  refreshToken?: string;
}

// 로그인 응답 데이터 타입
export interface LoginResponseData {
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
  profileImage?: string;
}

// NextAuth 타입 확장
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      profileImage?: string;
      accessToken?: string;
      refreshToken?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    profileImage?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    accessToken?: string;
    refreshToken?: string;
    profileImage?: string;
  }
}
