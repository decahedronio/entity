import { defaultMetadataStorage } from './storage';
import { StringHelper } from './StringHelper';
import { TypeMetadata } from './metadata/TypeMetadata';
import { Entity, Props, PropsJson } from '../Entity';

export function toJson<T extends Entity>(this: T, toSnake: boolean = true, asString: boolean = false): Props<T> | PropsJson<T> | string {
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
            data[outputKey] = value.toJson(toSnake, asString) as Props<typeof value>;

            continue;
        }

        const metadata: TypeMetadata = defaultMetadataStorage.findTypeMetadata(this.constructor, key);

        if (Array.isArray(value) && value.length > 0 && value[0] instanceof Object) {
            if (value[0] instanceof Entity) {
                data[outputKey] = value.map((entity: Entity) => entity.toJson(toSnake, asString));
            }

            if (metadata && metadata.type === Object) {
                data[outputKey] = value;
            }

            continue;
        }

        // If the key has been manually annotated as an object,
        // we will simply output the object itself.
        if (value !== null && typeof value === 'object' && !(Array.isArray(value))) {
            if (metadata && metadata.type === Object) {
                data[outputKey] = value;
            }

            continue;
        }

        data[outputKey] = value;
    }

    return asString ? JSON.stringify(data) : data;
}
