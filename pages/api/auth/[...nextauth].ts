import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"
// import GithubProvider from "next-auth/providers/github"
import DiscordProvider from "next-auth/providers/discord";
import ApiService from "../../../utils/ApiService";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

    const discordId = process.env.DISCORD_ID;
    const discordSecret = process.env.DISCORD_SECRET;

    if(discordId === undefined || discordSecret === undefined) {
        throw new Error("Discord Id And secret not null.");
    }

    return await NextAuth(req, res, {
        providers: [
            // GithubProvider({
            //     clientId: process.env.GITHUB_ID,
            //     clientSecret: process.env.GITHUB_SECRET,
            // }),
            DiscordProvider({
                clientId: discordId,
                clientSecret: discordSecret
            })
        ],
        secret: process.env.NEXTAUTH_SECRET,
        callbacks: {
            async session({ session, token, user }) {
                session.isAdmin = token.isAdmin;
                session.userId = token.userId;
                return session;
            },
            async jwt({ token, user, account, profile, isNewUser }) {
                
                if (user) {
                    const panelUser = await ApiService.getDashboardUser(user.id);
                    if (panelUser !== null) token.isAdmin = panelUser.roles.includes("admin");
                    token.userId = user.id;
                }

                return token;
            }
        }
    })
}