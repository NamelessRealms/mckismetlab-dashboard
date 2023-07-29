import { NextApiRequest, NextApiResponse } from "next";
import Utils from "../../../../../utils/Utils";

export interface IUserLinkProfile {
    id: number;
    minecraft_uuid: string;
    discord_id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        if (req.method === "POST") {

            const playerUuids = req.body;

            if(!Array.isArray(playerUuids)) {
                throw new Error("playerUuids not array.");
            }

            const playerUserLinkProfiles = new Array<IUserLinkProfile | null>();

            for(let playerUuid of playerUuids) {
                playerUserLinkProfiles.push(await getPlayerUserLinkProfile(playerUuid));
            }

            return res.status(200).json(playerUserLinkProfiles);

        } else if (req.method === "GET") {

            const playerUUID = req.query.uuid[0] as string;

            if (playerUUID === undefined) {
                return res.status(400).json({
                    error: "invalid_request",
                    error_description: "通訊協定錯誤，遺漏必要的參數或者參數格式錯誤。"
                });
            }

            const playerUserLinkProfiles = await getPlayerUserLinkProfile(playerUUID);

            return res.status(200).json(playerUserLinkProfiles);
        }

        return res.status(400).end();

    } catch (error) {
        return res.status(500).json({
            error: "server_error",
            error_description: "伺服器發生非預期的錯誤。"
        });
    }
}

async function getPlayerUserLinkProfile(playerUuid: string): Promise<IUserLinkProfile | null> {
    try {
        const playerUserLinkProfileResponse = await fetch(Utils.getApiUri() + "/user/userlink/" + playerUuid);

        if (!playerUserLinkProfileResponse.ok) {
            return null;
        }

        return await playerUserLinkProfileResponse.json();
    } catch (error) {
        return null;
    }
}