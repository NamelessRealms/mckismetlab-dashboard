import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import ApiService from "../../../utils/ApiService";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    return await NextAuth(req, res, {
        providers: [
            GithubProvider({
                clientId: process.env.GITHUB_ID,
                clientSecret: process.env.GITHUB_SECRET,
            })
        ],
        secret: process.env.NEXTAUTH_SECRET,
        callbacks: {
            async redirect({ url, baseUrl }) {
                return baseUrl + "/dashboard";
            },
            async session({ session, token, user }) {
                session.isAdmin = token.isAdmin;
                return session;
            },
            async jwt({ token, user, account, profile, isNewUser }) {

                if (user) {
                    const panelUser = await ApiService.getPanelUser(user.id);
                    if (panelUser !== null) token.isAdmin = panelUser.roles.includes("admin");
                }

                return token;
            }
        }
    })
}