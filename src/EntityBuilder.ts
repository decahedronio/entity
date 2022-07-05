import { Entity, PartialEntityJson } from './Entity';
import { Buildable, Constructor } from './support/Type';
import { TypeMetadata } from './support/metadata/TypeMetadata';
import { defaultMetadataStorage } from './support/storage';
import { isEntityType } from './support/isEntityType';
import { StringHelper } from './support/StringHelper';

export class EntityBuilder {
    public static enableCamelConversion = true;

    public static async buildOne<T extends Entity>(
        buildClass: Constructor<T>,
        sourceData: PartialEntityJson<T>,
    ): Promise<T> {
        const entity = new (buildClass)();
        await EntityBuilder.fill<T>(entity, sourceData);
        return entity;
    }

    public static async buildMany<T extends Entity>(
        buildClass: Constructor<T>,
        sourceData: Array<PartialEntityJson<T>>,
    ): Promise<Array<T>> {
        return Promise.all(
            sourceData.map(
                entityData => this.buildOne(buildClass, entityData),
            ),
        );
    }

    private static async fill<T extends Entity>(entity: T, data: PartialEntityJson<T>): Promise<T> {
        await Promise.all(
            Object.keys(data)
                // @ts-ignore
                .map(key => EntityBuilder.fillProperty<T>(entity, StringHelper.toCamel(key), data[key])),
        );

        return entity;
    }

    private static async fillProperty<T extends Entity>(entity: T, key: string, value: any): Promise<void> {
        const metadata: TypeMetadata = defaultMetadataStorage.findTypeMetadata(entity.constructor, key);

        if (metadata && (value !== null && typeof value !== 'undefined')) {
            await EntityBuilder.fillTypeDecoratedProperty<T>(entity, metadata, value);
            return;
        }

        // No type definition means scalar value, and we can just set that as is.
        entity.setProp(key, value);
    }

    private static async fillTypeDecoratedProperty<T extends Entity>(entity: T, metadata: TypeMetadata, value: InstanceType<Buildable>) {
        const type = await metadata.type;

        // We shouldn't copy objects to our entity, as the entity should be responsible for constructing these itself.
        if (typeof value === 'object' && !Array.isArray(value)) {
            if (isEntityType(type)) {
                entity.setProp(metadata.propertyName, await EntityBuilder.buildOne(type, value));
            } else {
                entity.setProp(metadata.propertyName, new type(value))
            }

            return;
        }

        // if we have an array, we check if it contains objects, in which case the entity itself should be assumed
        // responsible to construct the array of entities.
        if (Array.isArray(value) && value.length > 0) {
            if (isEntityType(type)) {
                entity.setProp(metadata.propertyName, await EntityBuilder.buildMany(type, value));
            } else {
                entity.setProp(metadata.propertyName, value.map(item => new type(item)));
            }

            return;
        }

        // Since all other scenarios have been exhausted, we're dealing with a primitive of some form.
        // This can be an empty array of objects too, but since it's empty, there's no need for us
        // to build an entity. As such, we can just assign it. The same goes for all primitives.
        entity.setProp(metadata.propertyName, value);
    }

    public static convertToCamel(convert = true) {
        this.enableCamelConversion = convert;
    }
}
