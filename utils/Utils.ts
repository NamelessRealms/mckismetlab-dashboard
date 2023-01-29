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

    public static formatDateTime(inputSecond: string | number) {
        const date = new Date(inputSecond);
        const y = date.getFullYear();
        let m: any = date.getMonth() + 1;
        m = m < 10 ? ("0" + m) : m;
        let d: any = date.getDate();
        d = d < 10 ? ("0" + d) : d;
        let h: any = date.getHours();
        h = h < 10 ? ("0" + h) : h;
        let minute: any = date.getMinutes();
        var second: any = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y+'-'+m+'-'+d+' '+' '+h+':'+minute+':'+second;
    }
}