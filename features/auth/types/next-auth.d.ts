declare module "next-auth" {
  interface User {
    id: string;
    email: string;
  }
  interface Session {
    user: User;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    accessToken: string;
    refreshToken: string;
  }
}
