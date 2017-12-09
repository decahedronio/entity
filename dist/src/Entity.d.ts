export declare class Entity {
    private static jsonParse<T>(sourceObject, jsonObject);
    fromJson(jsonData: any): any;
    toJson(toSnake?: boolean, asString?: boolean): any;
}
