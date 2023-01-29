import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        if (req.method === "POST") {

            const playerUuids = req.body;

            if(!Array.isArray(playerUuids)) {
                throw new Error("playerUuids not array.");
            }

            const playerProfiles = new Array<{ uuid: string, names: Array<{ changedToAt: number; name: string }> | null }>();

            for(let playerUuid of playerUuids) {
                const playerProfileNames = await getPlayerProfileNames(playerUuid);
                playerProfiles.push({
                    uuid: playerUuid,
                    names: playerProfileNames
                });
            }

            return res.status(200).json(playerProfiles);

        } else if (req.method === "GET") {

            const playerUUID = req.query.uuid[0] as string;

            if (playerUUID === undefined) {
                return res.status(400).json({
                    error: "invalid_request",
                    error_description: "通訊協定錯誤，遺漏必要的參數或者參數格式錯誤。"
                });
            }

            const playerProfileNames = await getPlayerProfileNames(playerUUID);

            return res.status(200).json({ uuid: playerUUID, names: playerProfileNames });
        }

        return res.status(400).end();

    } catch (error) {
        return res.status(500).json({
            error: "server_error",
            error_description: "伺服器發生非預期的錯誤。"
        });
    }
}

async function getPlayerProfileNames(playerUuid: string): Promise<Array<{ changedToAt: number; name: string }> | null> {
    try {
        const getPlayerNameUrl = `https://api.mojang.com/user/profiles/${playerUuid}/names`;
        const playerProfileNamesResponse = await fetch(getPlayerNameUrl);

        if (!playerProfileNamesResponse.ok) {
            return null;
        }

        return await playerProfileNamesResponse.json();
    } catch (error) {
        return null;
    }
}