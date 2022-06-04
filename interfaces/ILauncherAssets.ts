export default interface ILauncherAssets {
    version: string;
    updated: number,
    servers: Array<ILauncherAssetServer>
}

export interface ILauncherAssetServer {
    id: string;
    name: string;
    description: string;
    officialWebLinkUrl: string;
    imageUrl: string;
    action: {
        type: ILauncherAssetServerActionType,
        players: Array<ILauncherAssetServerActionPlayer>
    },
    java: ILauncherAssetServerJava,
    modpack: ILauncherAssetServerModpack | null,
    modules: Array<ILauncherAssetServerModule>,
    modLoader: {
        id: string;
        type: ILauncherAssetServerModLoaderType;
        version: string;
        download: {
            url: string;
        }
    } | null,
    minecraftType: ILauncherAssetServerMinecraftType,
    minecraftVersion: string;
}

export interface ILauncherAssetServerModpack {
    name: string;
    type: ILauncherAssetServerModpackType;
    fileId: number;
    version: string;
    projectId: number;
    downloadUrl: string;
    imageUrl: string;
    linkUrl: string;
}

export interface ILauncherAssetServerActionPlayer {
    name: string;
    uuid: string;
}

export interface ILauncherAssetServerModule {
    [parameter: string]: string | number | ILauncherAssetServerModuleType | ILauncherAssetServerModulesAction;
    name: string;
    type: ILauncherAssetServerModuleType;
    action: ILauncherAssetServerModulesAction;
    fileId: number;
    version: string;
    projectId: number;
    downloadUrl: string;
}

export interface ILauncherAssetServerJava {
    [system: string]: {
        version: string;
        download: {
            url: string;
            fileName: string;
        }
    };
    windows: {
        version: string;
        download: {
            url: string;
            fileName: string;
        }
    },
    osx: {
        version: string;
        download: {
            url: string;
            fileName: string;
        }
    }
}

export type ILauncherAssetServeSystemJavaType = "windows" | "osx";
export type ILauncherAssetServerModuleType = "CurseForge";
export type ILauncherAssetServerActionType = "all" | "whitelist" | "blacklist";
export type ILauncherAssetServerModpackType = "Revise" | "CurseForge" | "FTB";
export type ILauncherAssetServerModulesAction = "ADD" | "Remove";
export type ILauncherAssetServerModLoaderType = "Forge" | "Fabric";
export type ILauncherAssetServerMinecraftType = "minecraftModpack" | "minecraftModules" | "minecraftVanilla";