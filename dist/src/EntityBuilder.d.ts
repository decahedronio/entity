export declare class EntityBuilder {
    static buildOne<T>(buildClass: any, sourceData: Object): T | any;
    static buildMany<T>(buildClass: any, sourceData: Object[]): T[];
    private static checkClassValidity(className);
}
