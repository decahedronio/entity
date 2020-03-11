import { defaultMetadataStorage } from './storage';
import { EntityBuilder } from '../EntityBuilder';
import { StringHelper } from './StringHelper';
import { TypeMetadata } from './metadata/TypeMetadata';

export function Type(type?: Function, jsonKey?: string) {
    return function (target: any, key: string) {
        jsonKey = jsonKey ? jsonKey : (
            EntityBuilder.enableCamelConversion ? StringHelper.toSnake(key) : key
        );

        const metadata = new TypeMetadata(target.constructor, key, jsonKey, type);
        defaultMetadataStorage.addTypeMetadata(metadata);
    };
}
