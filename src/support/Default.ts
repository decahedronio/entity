import 'reflect-metadata';
import {defaultMetadataStorage} from "./storage";
import {DefaultValueCallbackMetadata} from "./metadata/MetadataStorage";

export type TypeOf<T> = { new(): T }

export function Default<T>(callback: () => T, condition: (value: T) => boolean = (value) => value === null): (target: Object, propertyKey: string) => void {
    return function<T>(target: Function, propertyKey: string) {
        defaultMetadataStorage.addDefaultCallback(new DefaultValueCallbackMetadata(target.constructor, propertyKey, callback, condition))
    }
}
