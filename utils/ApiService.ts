import ILauncherAssets from "../interfaces/ILauncherAssets";
import IMinecraftProfile from "../interfaces/IMinecraftProfile";

interface IPanelUser {
    id: string;
    github_user_name: string;
    github_user_email: string;
    github_user_id: string;
    roles: Array<string>;
}

export default class ApiService {

    public static apiServerUrl = process.env.NODE_ENV === "development" ? "http://localhost:8030" : "https://namelessrealms.com/api"

    private static _mojangUrl = "https://api.mojang.com/users/profiles";

    public static async getMinecraftPlayerUUID(playerName: string): Promise<string | null> {

        const profileResource = await fetch(this._mojangUrl + `/minecraft/${playerName}`);

        if (profileResource.status === 200) {
            const profile = await profileResource.json() as IMinecraftProfile;
            return profile.id;
        }

        return null;
    }

    public static async getLauncherAssets(): Promise<ILauncherAssets | null> {

        const url = `${this.apiServerUrl}/launcher/v2/assets`;
        const launcherAssetsResponse = await fetch(url);

        let launcherAssets: { id: number, date: string, assets_data: ILauncherAssets } | null = null;

        if (launcherAssetsResponse.status === 200) {
            launcherAssets = await launcherAssetsResponse.json();
        }

        return launcherAssets !== null ? launcherAssets.assets_data : null;
    }

    public static async getDashboardUser(id: string): Promise<IPanelUser | null> {

        const url = `${ApiService.apiServerUrl}/user/dashboard/${id}`;
        const panelUserResponse = await fetch(url);
        if (panelUserResponse.status !== 200) return null;

        return await panelUserResponse.json();
    }
}