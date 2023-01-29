import ky from "ky";

export interface IDiscordUser {
    id: string;
    username: string;
    avatar: string | null;
    avatar_decoration: any;
    discriminator: string;
    public_flags: number;
    banner: string | null;
    banner_color: string;
    accent_color: number;
}

export interface IDiscordMember {
    user: IDiscordUser | null;
    roles: Array<string>;
    avatar: string | null;
    nick: string | null;
    joined_at: string;
    premium_since: string | null;
    deaf: boolean;
    mute: boolean;
    pending: boolean | null;
    permissions: string | null;
    communication_disabled_until: string | null;
}

export default class User {

    public static async getDiscordUser(discordUserId: string): Promise<IDiscordUser | null> {

        const discordUserResponse = await ky(`/dashboard/api/discord/users/${discordUserId}`);

        if(!discordUserResponse.ok) {
            return null;
        }

        return await discordUserResponse.json();
    }

    public static async getDiscordGuildMember(guildId: string, discordUserId: string): Promise<IDiscordMember | null> {

        const discordGuildMemberResponse = await ky(`/dashboard/api/discord/guilds/${guildId}/members/${discordUserId}`);

        if(!discordGuildMemberResponse.ok) {
            return null;
        }

        return await discordGuildMemberResponse.json();
    }
}