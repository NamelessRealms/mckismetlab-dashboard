import nextConfig from "next/config";
import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import ApiService from "../../../utils/ApiService";

const { serverRuntimeConfig } = nextConfig();

console.log(serverRuntimeConfig);

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
    return await NextAuth(req, res, {
        providers: [
            GithubProvider({
                clientId: serverRuntimeConfig.GITHUB_ID,
                clientSecret: serverRuntimeConfig.GITHUB_SECRET,
            })
        ],
        secret: serverRuntimeConfig.NEXTAUTH_SECRET,
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