import { NextApiRequest, NextApiResponse } from "next";
import ReplyApiError from "../../../../utils/ReplyApiError";
import DiscordGot from "../../../../utils/Got/DiscordGot";
import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        const session = await getSession({ req });

        if(session === null || !session.isAdmin) {
            return ReplyApiError.replyUnauthorized(res);
        }

        const userId = req.query.userId[0] as string;

        if (userId === undefined) {
            return ReplyApiError.replyParameterError(res);
        }

        const userResponse = await DiscordGot.get(`${process.env.discordApiBaseUrl}/users/${userId}`);

        if(!userResponse.ok) {
            throw new Error("Get discord api user error.");
        }

        return res.status(200).json(userResponse.body);

    } catch (error) {
        ReplyApiError.replyServerError(res);
    }
}