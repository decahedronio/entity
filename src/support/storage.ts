/// <reference path="../Entity.ts" />
namespace Decahedron {
    export namespace Entity {
        /**
         * Default metadata storage is used as singleton and can be used to storage all metadatas.
         */
        export const defaultMetadataStorage = new MetadataStorage();
    }
}