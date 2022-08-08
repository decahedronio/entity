import { defaultMetadataStorage } from './support/storage';
import { TypeMetadata } from './support/metadata/TypeMetadata';
import { StringHelper } from './support/StringHelper';

type Snake<T extends string> =
    string extends T ? string :
        T extends `${infer C0}${infer R}`
            ? `${C0 extends "_" ? "" : C0 extends Uppercase<C0> ? "_" : ""}${Lowercase<C0>}${Snake<R>}`
            : "";

export type Props<T extends Entity> = {
    [K in keyof T as T[K] extends Function ? never : Extract<K, string>]:
        T[K] extends Entity[] ? Props<T[K][number]>[] :
            T[K] extends Entity ? Props<T[K]> :
                T[K]
}

export type PropsJson<T extends Entity> = {
    [K in keyof T as T[K] extends Function ? never : Snake<Extract<K, string>>]:
        T[K] extends Entity[] ? PropsJson<T[K][number]>[] :
            T[K] extends Entity ? PropsJson<T[K]> :
                T[K]
}

export type PartialProps<T extends Entity> = Partial<{
    [K in keyof T as T[K] extends Function ? never : Extract<K, string>]:
        T[K] extends Entity[] ? PartialProps<T[K][number]>[] :
            T[K] extends Entity ? PartialProps<T[K]> :
                T[K]
}>

export type PartialPropsJson<T extends Entity> = Partial<{
    [K in keyof T as T[K] extends Function ? never : Snake<Extract<K, string>>]:
        T[K] extends Entity[] ? PartialPropsJson<T[K][number]>[] :
            T[K] extends Entity ? PartialPropsJson<T[K]> :
                T[K]
}>

export class Entity {
    [key: string]: any;

    hasProp(key: string): boolean {
        if (key in this) {
            return true;
        }

        return !!defaultMetadataStorage.findTypeMetadata(this.constructor, key);
    }

    getProp(key: string) {
        if (!this.hasProp(key)) {
            return;
        }

        return this[key];
    }

    setProp(key: string, value: any) {
        if (!this.hasProp(key)) {
            return;
        }

        this[key] = value;
    }

    toJson(toSnake?: true, asString?: false): PropsJson<this>;
    toJson(toSnake?: false, asString?: false): Props<this>;
    toJson(toSnake?: boolean, asString?: false): Props<this> | PropsJson<this>;
    toJson(toSnake?: boolean, asString?: true): string;
    toJson(toSnake?: boolean, asString?: boolean): Props<this> | PropsJson<this> | string;

    /*
     * Convert an Entity to JSON, either in object or string format.
     */
    toJson(toSnake: boolean = true, asString: boolean = false): Props<this> | PropsJson<this> | string {
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
}
