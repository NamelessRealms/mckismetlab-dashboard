import ILauncherAssets from "../interfaces/ILauncherAssets";
import IMinecraftProfile from "../interfaces/IMinecraftProfile";

export default class ApiService {

    public static apiServerUrl = process.env.NODE_ENV === "development" ? "http://localhost:8030" : process.env.NEXT_PUBLIC_MKL_API_SERVER_URL;

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
}