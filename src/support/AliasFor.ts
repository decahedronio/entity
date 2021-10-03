import { Entity } from '../Entity';
import { EntityBuilder } from '../EntityBuilder';
import { StringHelper } from './StringHelper';
import { TypeMetadata } from './metadata/TypeMetadata';
import { defaultMetadataStorage } from './storage';

export function AliasFor(key?: string) {
    return function (target: Entity, jsonKey: string) {
        jsonKey = jsonKey ? jsonKey : (
            EntityBuilder.enableCamelConversion ? StringHelper.toSnake(key) : key
        );

        const metadata = new TypeMetadata(target.constructor, key, jsonKey, (value: any) => value);
        defaultMetadataStorage.addTypeMetadata(metadata);
    };
}
