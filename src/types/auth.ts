export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  statusMessage: string;
  statusCode: string;
  data: T;
}

export interface AuthTokens {
  authorization?: string;
  refreshToken?: string;
}

// NextAuth 타입 확장
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
      refreshToken?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    provider?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}
