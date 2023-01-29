import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import DiscordGot from "../../../../../../utils/Got/DiscordGot";
import ReplyApiError from "../../../../../../utils/ReplyApiError";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        const session = await getSession({ req });

        if(session === null || !session.isAdmin) {
            ReplyApiError.replyUnauthorized(res);
            return;
        }

        const guildId = req.query.guildId as string;
        const memberId = req.query.memberId as string;

        if (guildId === undefined || memberId === undefined) {
            ReplyApiError.replyParameterError(res);
            return;
        }

        const guildMemberResponse = await DiscordGot.get(`${process.env.discordApiBaseUrl}/guilds/${guildId}/members/${memberId}`);

        if(!guildMemberResponse.ok) {
            throw new Error("Get discord api user error.");
        }

        return res.status(200).json(guildMemberResponse.body);

    } catch (error) {
        ReplyApiError.replyServerError(res);
    }
}