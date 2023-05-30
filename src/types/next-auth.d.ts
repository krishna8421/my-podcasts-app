import { type DefaultSession } from "next-auth";
import 'next-auth/jwt'

declare module 'next-auth/jwt' {
  interface JWT {
    role: string
  }
}

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      role: string;
    } & DefaultSession["user"];
    
  }

  interface User {
    role: string
  }
}
