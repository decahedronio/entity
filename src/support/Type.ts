import { defaultMetadataStorage } from './storage';
import { EntityBuilder } from '../EntityBuilder';
import { StringHelper } from './StringHelper';
import { TypeMetadata } from './metadata/TypeMetadata';
import { Entity } from '../Entity';

// Types that can be passed as first argument to `EntityBuilder`.
export type Buildable = typeof Entity | ({ new(): any });
export type DefaultExportedBuildable = { default: Buildable };
export type PackedBuildable = Buildable | DefaultExportedBuildable;

export type BuildableResolverSync = () => PackedBuildable;
export type BuildableResolverAsync = () => Promise<PackedBuildable>;
export type BuildableResolver = BuildableResolverAsync | BuildableResolverSync;

// Types that can be passed to @Type decorator factory.
export type Typeable = Buildable | BuildableResolver;

export function Type<T extends Typeable>(type?: T, jsonKey?: string) {
    return function (target: Entity, key: string) {
        jsonKey = jsonKey ? jsonKey : (
            EntityBuilder.enableCamelConversion ? StringHelper.toSnake(key) : key
        );

        const metadata = new TypeMetadata(target.constructor as typeof Entity, key, jsonKey, type);
        defaultMetadataStorage.addTypeMetadata(metadata);
    };
}
