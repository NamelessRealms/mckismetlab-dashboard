import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt"

declare module "next-auth" {

    interface Session {
        isAdmin?: boolean;
        userId: string;
    }
}

declare module "next-auth/jwt" {

    interface JWT {
        isAdmin?: boolean;
        userId: string;
    }
}