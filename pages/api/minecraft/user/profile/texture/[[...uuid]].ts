import { NextApiRequest, NextApiResponse } from "next";

interface IMinecraftSessionProfile {
    id: string;
    name: string;
    properties: Array<{
        name: string;
        value: string;
    }>
}

interface IMinecraftPlayerTexture {
    timestamp: number;
    profileId: string;
    profileName: string;
    textures: {
        SKIN?: {
            url: string;
        };
        CAPE?: {
            url: string;
        }
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        if (req.method === "POST") {

            const playerUUIDs = req.body;

            if(!Array.isArray(playerUUIDs)) {
                throw new Error("playerUUIDs not array.");
            }

            const playerTextures = new Array<{ uuid: string, textures: { skin: string | null; cape: string | null; } | null }>();

            for(let playerUUID of playerUUIDs) {
                const playerTexture = await getPlayerTextureUrl(playerUUID);
                playerTextures.push({
                    uuid: playerUUID,
                    textures: playerTexture
                });
            }

            return res.status(200).json(playerTextures);

        } else if (req.method === "GET") {

            const playerUUID = req.query.uuid[0] as string;

            if (playerUUID === undefined) {
                return res.status(400).json({
                    error: "invalid_request",
                    error_description: "通訊協定錯誤，遺漏必要的參數或者參數格式錯誤。"
                });
            }

            const playerTexture = await getPlayerTextureUrl(playerUUID);

            return res.status(200).json({ uuid: playerUUID, textures: playerTexture });
        }

        return res.status(400).end();

    } catch (error) {
        return res.status(500).json({
            error: "server_error",
            error_description: "伺服器發生非預期的錯誤。"
        });
    }
}

async function getPlayerTextureUrl(playerUuid: string): Promise<{ skin: string | null; cape: string | null; } | null> {
    try {
        const playerProfileResponse = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${playerUuid}`);

        if (!playerProfileResponse.ok) {
            return null;
        }

        const playerProfile: IMinecraftSessionProfile = await playerProfileResponse.json();

        const playerTextures = playerProfile.properties.find((propertie) => propertie.name === "textures");
        if(playerTextures === undefined) return null;
        const playerTexturesBase64 = playerTextures.value;

        const playerTexture: IMinecraftPlayerTexture = JSON.parse(Buffer.from(playerTexturesBase64 as any, "base64").toString("utf8"));

        return {
            skin: playerTexture.textures.SKIN !== undefined ? playerTexture.textures.SKIN.url : null,
            cape: playerTexture.textures.CAPE !== undefined ? playerTexture.textures.CAPE.url : null
        }

    } catch (error) {
        return null;
    }
}