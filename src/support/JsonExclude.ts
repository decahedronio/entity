import { defaultMetadataStorage } from './storage';
import {JsonExcludeMetadata} from './metadata/JsonExcludeMetadata';

export function JsonExclude() {
    return function (target: any, key: string) {
        const metadata = new JsonExcludeMetadata(target.constructor, key);
        defaultMetadataStorage.addExcludeProperty(metadata);
    };
}
