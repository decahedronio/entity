import { Entity, PartialPropsJson } from './Entity';
import { Buildable, Constructor } from './support/Type';
import { TypeMetadata } from './support/metadata/TypeMetadata';
import { defaultMetadataStorage } from './support/storage';
import { isEntityType } from './support/isEntityType';
import { StringHelper } from './support/StringHelper';

export class EntityBuilder {
    public static buildOne<T extends Entity>(
        buildClass: Constructor<T>,
        sourceData: PartialPropsJson<T>,
    ): T {
        const entity = new (buildClass)();
        EntityBuilder.fill<T>(entity, sourceData);
        return entity;
    }

    public static buildMany<T extends Entity>(
        buildClass: Constructor<T>,
        sourceData: Array<PartialPropsJson<T>>,
    ): Array<T> {
        return sourceData.map(
            entityData => this.buildOne(buildClass, entityData),
        );
    }

    private static fill<T extends Entity>(entity: T, data: PartialPropsJson<T>): T {
        for (let key in data) {
            EntityBuilder.fillProperty<T>(entity, key, data[key]);
        }

        return entity;
    }

    private static fillProperty<T extends Entity>(entity: T, key: string, value: any): void {
        const metadata: TypeMetadata = defaultMetadataStorage.findTypeMetadata(entity.constructor, key);

        if (metadata && (value !== null && typeof value !== 'undefined')) {
            EntityBuilder.fillTypeDecoratedProperty<T>(entity, metadata, value);
            return;
        }

        // No type definition means scalar value, and we can just set that as is.
        entity.setProp(StringHelper.toCamel(key), value);
    }

    private static fillTypeDecoratedProperty<T extends Entity>(entity: T, metadata: TypeMetadata, value: InstanceType<Buildable>) {
        // We shouldn't copy objects to our entity, as the entity should be responsible for constructing these itself.
        if (typeof value === 'object' && !Array.isArray(value)) {
            if (isEntityType(metadata.type)) {
                entity.setProp(metadata.propertyName, EntityBuilder.buildOne(metadata.type, value));
            } else {
                entity.setProp(metadata.propertyName, new metadata.type(value))
            }

            return;
        }

        // if we have an array, we check if it contains objects, in which case the entity itself should be assumed
        // responsible to construct the array of entities.
        if (Array.isArray(value) && value.length > 0) {
            if (isEntityType(metadata.type)) {
                entity.setProp(metadata.propertyName, EntityBuilder.buildMany(metadata.type, value));
            } else {
                entity.setProp(metadata.propertyName, value.map(item => new metadata.type(item)));
            }

            return;
        }

        // Since all other scenarios have been exhausted, we're dealing with a primitive of some form.
        // This can be an empty array of objects too, but since it's empty, there's no need for us
        // to build an entity. As such, we can just assign it. The same goes for all primitives.
        entity.setProp(metadata.propertyName, value);
    }
}
