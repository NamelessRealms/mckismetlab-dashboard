import ky from "ky";

export interface DiscordGuildRole {
    id: string,
    name: string,
    description: string | null,
    permissions: string,
    position: number,
    color: number,
    hoist: boolean,
    managed: boolean,
    mentionable: boolean,
    icon: string | null,
    unicode_emoji: string | null,
    flags: number
}

export default class DiscordRole {

    public static async getDiscordGuildRoles(guildId: string): Promise<Array<DiscordGuildRole> | null> {

        const discordGuildRolesResponse = await ky(`/dashboard/api/discord/guilds/${guildId}/roles`);

        if(!discordGuildRolesResponse.ok) {
            return null;
        }

        return await discordGuildRolesResponse.json();
    }

}