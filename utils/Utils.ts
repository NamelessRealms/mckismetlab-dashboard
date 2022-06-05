import { v4 as uuidV4 } from "uuid";
import { ILauncherAssetServer, ILauncherAssetServerMinecraftType } from "../interfaces/ILauncherAssets";

export default class Utils {

    public static copyObjectArray<Type>(value: Type): Type {
        return JSON.parse(JSON.stringify(value));
    }

    public static removeItemUniqueId<Type extends { uniqueId?: string }>(objects: Array<Type>): Array<Type> {
        const newObjects = this.copyObjectArray(objects);
        for(let i = 0; i < newObjects.length; i++) {
            delete newObjects[i].uniqueId;
        }
        return newObjects;
    }

    public static addItemUniqueId<Type extends { uniqueId: string }>(objects: Array<any>): Array<any> {
        const newObjects = this.copyObjectArray(objects);
        const returnNewObjects = new Array<Type>();
        for(let newObject of newObjects) {
            newObject.uniqueId = uuidV4();
            returnNewObjects.push(newObject);
        }
        return returnNewObjects;
    }

    public static getRunMinecraftType(launcherAssetServer: ILauncherAssetServer): ILauncherAssetServerMinecraftType {
        if(launcherAssetServer.modpack !== null) return "minecraftModpack";
        if(launcherAssetServer.modpack === null && launcherAssetServer.modules.length > 0) return "minecraftModules";
        return "minecraftVanilla";
    }
}