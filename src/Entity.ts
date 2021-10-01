import { EntityBuilder } from './EntityBuilder';
import { defaultMetadataStorage } from './support/storage';
import { TypeMetadata } from './support/metadata/TypeMetadata';
import { StringHelper } from './support/StringHelper';

type CamelToSnake<T extends string> = string extends T ? string :
    T extends `${infer C0}${infer R}` ?
        `${C0 extends "_" ? "" : C0 extends Uppercase<C0> ? "_" : ""}${Lowercase<C0>}${CamelToSnake<R>}` :
        "";

type CamelKeysToSnake<T> = T extends readonly any[] ?
    { [K in keyof T]: CamelKeysToSnake<T[K]> } :
    T extends object ? {
        [K in keyof T as CamelToSnake<Extract<K, string>>]: CamelKeysToSnake<T[K]>
    } : T;

type EntityPropsOnly<T> = {
    [K in keyof T as T[K] extends Function ? never : K]: T[K] extends Entity
        ? EntityPropsOnly<T[K]>
        : (
            T[K] extends Entity[]
                ? EntityPropsOnly<T[K][]>
                : T[K]
        );
}

export class Entity {

    private static async jsonParseAsync<T extends Entity>(sourceObject: T, jsonObject: Partial<CamelKeysToSnake<EntityPropsOnly<T>>>): Promise<T> {
        const obj = Entity.jsonParse<T>(sourceObject, jsonObject, true);
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                obj[key] = await obj[key];
            }
        }
        return obj;
    }

    /*
     * Parse a generic object into an entity object.
     */
    private static jsonParse<T extends Entity>(entity: T, data: Partial<CamelKeysToSnake<EntityPropsOnly<T>>>, async = false): T {
        for (let key in data) {
            if (!data.hasOwnProperty(key)) {
                continue;
            }

            let value = data[key] as any;

            const metadata: TypeMetadata = defaultMetadataStorage.findTypeMetadata(entity.constructor, key);

            // We shouldn't copy objects to our entity, as the entity
            // should be responsible for constructing these itself.
            if (value !== null && typeof value === 'object' && !(value instanceof Array)) {
                if (metadata) {
                    entity.setProp(
                        metadata.propertyName,
                        async
                            ? EntityBuilder.buildOneAsync(metadata.type, value)
                            : EntityBuilder.buildOne(metadata.type, value)
                    );
                }
                continue;
            }
            // if we have an array, we check if it contains objects,
            // in which case the entity itself should be assumed
            // responsible to construct the array of entities.
            if (value instanceof Array && value.length > 0 && typeof value[0] === 'object') {
                if (metadata) {
                    entity.setProp(
                        metadata.propertyName,
                        async
                            ? EntityBuilder.buildManyAsync(metadata.type, value)
                            : EntityBuilder.buildMany(metadata.type, value)
                    );
                }
                continue;
            }
            // Since all other scenarios have been exhausted, we're dealing with a primitive of some form.
            // This can be an empty array of objects too, but since it's empty, there's no need for us
            // to build an entity. As such, we can just assign it. The same goes for all primitives.
            if (metadata) {
                entity.setProp(metadata.propertyName, value);
                continue;
            }
            const newKey = EntityBuilder.enableCamelConversion ? StringHelper.toCamel(key) : key;
            if (entity.hasOwnProperty(newKey)) {
                entity.setProp(newKey, value);
            }
            const defaultValueCallback = defaultMetadataStorage.findCallback(entity.constructor, newKey);
            if (defaultValueCallback && defaultValueCallback.condition(entity.getProp(newKey))) {
                entity.setProp(newKey, defaultValueCallback.callback());
            }
        }
        return entity as T;
    }

    private getProp(key: string) {
        if (!this.hasOwnProperty(key)) {
            return;
        }

        return (this as any)[key];
    }

    private setProp(key: string, value: any) {
        if (!this.hasOwnProperty(key)) {
            return;
        }

        (this as any)[key] = value;
    }

    /*
     * Convert JSON data to an Entity instance.
     */
    fromJson<T extends Entity>(this: T, jsonData: Partial<CamelKeysToSnake<EntityPropsOnly<T>>>): void {
        Entity.jsonParse<T>(this, jsonData);
    }

    /*
     * Convert JSON data to an Entity instance that has async types.
     */
    async fromJsonAsync<T extends Entity>(this: T, jsonData: Partial<CamelKeysToSnake<EntityPropsOnly<T>>>): Promise<void> {
        await Entity.jsonParseAsync<T>(this, jsonData);
    }

    toJson(toSnake?: true, asString?: false): CamelKeysToSnake<EntityPropsOnly<this>>;
    toJson(toSnake?: false, asString?: false): EntityPropsOnly<this>;
    toJson(toSnake?: boolean, asString?: false): EntityPropsOnly<this> | CamelKeysToSnake<EntityPropsOnly<this>>;
    toJson(toSnake?: boolean, asString?: true): string;
    toJson(toSnake?: boolean, asString?: boolean): EntityPropsOnly<this> | CamelKeysToSnake<EntityPropsOnly<this>> | string;

    /*
     * Convert an Entity to JSON, either in object or string format.
     */
    toJson(toSnake: boolean = true, asString: boolean = false): EntityPropsOnly<this> | CamelKeysToSnake<EntityPropsOnly<this>> | string {
        const data: any = {};

        for (let key in this) {
            if (!this.hasOwnProperty(key)) {
                continue;
            }

            // exclude any properties with `@JsonExclude()`
            if (defaultMetadataStorage.isPropertyExcluded(this.constructor, key)) {
                continue;
            }

            let outputKey = toSnake ? StringHelper.toSnake(key) : key;

            const value: any = this[key];

            if (value instanceof Entity) {
                data[outputKey] = value.toJson(toSnake, asString) as EntityPropsOnly<typeof value>;

                continue;
            }

            const metadata: TypeMetadata = defaultMetadataStorage.findTypeMetadata(this.constructor, key);

            if (value instanceof Array && value.length > 0 && value[0] instanceof Object) {
                if (value[0] instanceof Entity) {
                    data[outputKey] = value.map((entity: Entity) => entity.toJson(toSnake, asString)) as EntityPropsOnly<typeof value>;
                }

                if (metadata && metadata.type === Object) {
                    data[outputKey] = value;
                }

                continue;
            }

            // If the key has been manually annotated as an object,
            // we will simply output the object itself.
            if (value !== null && typeof value === 'object' && !(value instanceof Array)) {
                if (metadata && metadata.type === Object) {
                    data[outputKey] = value;
                }

                continue;
            }

            data[outputKey] = value;
        }

        return asString ? JSON.stringify(data) : data;
    }
}
