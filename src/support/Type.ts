import { defaultMetadataStorage } from './storage';
import { StringHelper } from './StringHelper';
import { TypeMetadata } from './metadata/TypeMetadata';
import { Entity } from '../Entity';

export type Constructor<T> = { new(...args: any): T };

// Types that can be passed as first argument to `EntityBuilder`.
export type Buildable = Constructor<Entity> | typeof Object | typeof String | typeof Number | typeof Boolean;
export type DefaultExportedBuildable = { default: Buildable };
export type PackedBuildable = Buildable | DefaultExportedBuildable;

export type BuildableResolver = () => PackedBuildable;

// Types that can be passed to @Type decorator factory.
export type Typeable = Buildable | BuildableResolver;

export function Type<T extends Typeable>(type: T, jsonKey?: string) {
    return function (target: Entity, key: string) {
        jsonKey = jsonKey ?? StringHelper.toSnake(key);

        const metadata = new TypeMetadata(target.constructor as Constructor<Entity>, key, jsonKey, type);
        defaultMetadataStorage.addTypeMetadata(metadata);
    };
}
