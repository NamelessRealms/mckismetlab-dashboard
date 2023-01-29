import { NextApiRequest, NextApiResponse } from "next";
import ReplyApiError from "../../../../../utils/ReplyApiError";
import DiscordGot from "../../../../../utils/Got/DiscordGot";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        const session = await getSession({ req });

        if(session === null || !session.isAdmin) {
            ReplyApiError.replyUnauthorized(res);
            return;
        }

        const guildId = req.query.guildId[0] as string;

        if (guildId === undefined) {
            ReplyApiError.replyParameterError(res);
            return;
        }

        const guildResponse = await DiscordGot.get(`${process.env.discordApiBaseUrl}/guilds/${guildId}`);

        // console.log(guildResponse.body);

    } catch (error) {
        ReplyApiError.replyServerError(res);
    }
}