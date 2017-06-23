/// <reference path="./StringHelper.ts" />
/// <reference path="./metadata/TypeMetadata.ts" />
/// <reference path="./storage.ts" />

namespace Decahedron {
    export namespace Entity {
        export function Type(type?: Function, jsonKey?: string) {
            return function(target: any, key: string) {
                jsonKey = jsonKey ? jsonKey : StringHelper.toSnake(key);

                const metadata = new TypeMetadata(target.constructor, key, jsonKey, type);
                defaultMetadataStorage.addTypeMetadata(metadata);
            };
        }
    }
}
