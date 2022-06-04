import { v4 as uuidV4 } from "uuid";

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
}