import { NextApiRequest, NextApiResponse } from "next";
import got from "got";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        if (req.method === "POST") {

            const playerNames = req.body;

            if (!Array.isArray(playerNames)) {
                throw new Error("playerUuids not array.");
            }

            const playerProfilesUUID = await getPlayerProfileUUID(playerNames);

            return res.status(200).json(playerProfilesUUID);

        } else if (req.method === "GET") {

            const playerName = req.query.name[0] as string;

            if (playerName === undefined) {
                return res.status(400).json({
                    error: "invalid_request",
                    error_description: "通訊協定錯誤，遺漏必要的參數或者參數格式錯誤。"
                });
            }

            const playerProfileNames = await getPlayerProfileUUID(playerName);

            return res.status(200).json(playerProfileNames);
        }

        return res.status(400).end();

    } catch (error) {
        return res.status(500).json({
            error: "server_error",
            error_description: "伺服器發生非預期的錯誤。"
        });
    }
}

async function getPlayerProfileUUID(playerName: string | Array<string>): Promise<{ id: string; name: string } | Array<{ id: string; name: string }> | null> {
    try {

        if (!Array.isArray(playerName)) {

            const getPlayerUUIDUrl = `https://api.mojang.com/users/profiles/minecraft/${playerName}`;
            const playerProfileUUIDResponse = await fetch(getPlayerUUIDUrl);

            if (!playerProfileUUIDResponse.ok) {
                return null;
            }

            return await playerProfileUUIDResponse.json();

        } else if(Array.isArray(playerName)) {

            const playerProfileUUIDResponse = await got.post<Array<{ id: string; name: string }>>("https://api.mojang.com/profiles/minecraft", {
                json: playerName,
                responseType: "json"
            });

            if(!playerProfileUUIDResponse.ok) {
                return null;
            }

            return playerProfileUUIDResponse.body;
        }

        return null;

    } catch (error) {
        return null;
    }
}