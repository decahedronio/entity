import { Entity } from './Entity';
import { Buildable } from './support/Type';

export class EntityBuilder {

    public static enableCamelConversion = true;

    public static buildOne<T extends Buildable>(buildClass: T, sourceData: object): T extends typeof Entity ? T : object;

    /*
     * Build an entity object from source data.
     */
    public static buildOne<T extends Buildable>(buildClass: T, sourceData: object): T | object {
        this.checkClassValidity(buildClass);

        const entity = new (buildClass)();

        if (!(entity instanceof Entity)) {
            return sourceData;
        }

        entity.fromJson(sourceData);

        return entity;
    }

    public static async buildOneAsync<T extends (Buildable | Promise<Buildable>)>(buildClass: T, sourceData: object): Promise<T extends typeof Entity ? T : object>;

    public static async buildOneAsync<T extends (Buildable | Promise<Buildable>)>(buildClass: T, sourceData: object): Promise<T | object> {
        const resolvedBuildClass: Buildable = await buildClass;

        this.checkClassValidity(resolvedBuildClass);

        const entity = new (resolvedBuildClass)();

        if (!(entity instanceof Entity)) {
            return sourceData;
        }

        await entity.fromJsonAsync(sourceData);

        return entity;
    }

    /*
     * Build multiple entities from an array of source data.
     */
    public static buildMany<T extends Buildable>(buildClass: T, sourceData: Object[]): T[] | object[] {
        this.checkClassValidity(buildClass);

        return sourceData.map(entityData => this.buildOne(buildClass, entityData));
    }

    /*
     * Build multiple entities from an array of source data.
     */
    public static async buildManyAsync<T extends (Buildable | Promise<Buildable>)>(buildClass: T, sourceData: Object[]): Promise<T[] | object[]> {
        return Promise.all(sourceData.map(entityData => this.buildOneAsync(buildClass, entityData)));
    }

    public static convertToCamel(convert = true) {
        this.enableCamelConversion = convert;
    }

    /*
     * Check if a valid class was passed through.
     */
    private static checkClassValidity(className: any) {
        if (typeof className !== 'function') {
            throw new Error('Class could not be found');
        }
    }
}
