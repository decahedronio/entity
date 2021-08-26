import { TypeMetadata } from './TypeMetadata';
import {JsonExcludeMetadata} from './JsonExcludeMetadata';

export class DefaultValueCallbackMetadata {
    constructor(public target: Function,
                public propertyName: string,
                public callback: () => any,
                public condition: (value: any) => boolean) {}
}

/**
 * Storage all library metadata.
 */
export class MetadataStorage {

    /**
     * All the type metadata.
     *
     * @type {Array}
     */
    private typeMetadatas: TypeMetadata[] = [];
    private defaultCallbacks: DefaultValueCallbackMetadata[] = [];
    private excludedProperties: JsonExcludeMetadata[] = [];

    /**
     * Append type metadata.
     *
     * @param metadata
     */
    addTypeMetadata(metadata: TypeMetadata) {
        this.typeMetadatas.push(metadata);
    }

    addDefaultCallback(callbackMetadata: DefaultValueCallbackMetadata) {
        this.defaultCallbacks.push(callbackMetadata);
    }

    addExcludeProperty(excludeMeta: JsonExcludeMetadata) {
        this.excludedProperties.push(excludeMeta);
    }

    /**
     * Find a type metadata.
     *
     * @param target
     * @param propertyName
     * @returns {TypeMetadata}
     */
    findTypeMetadata(target: any, propertyName: string): TypeMetadata {
        const metadataFromTarget = this.typeMetadatas.find(meta =>
            meta.target === target && meta.sourcePropertyName === propertyName,
        );

        const metadataFromChildren = this.typeMetadatas.find(meta =>
            target.prototype instanceof meta.target && meta.sourcePropertyName === propertyName,
        );

        return metadataFromTarget || metadataFromChildren;
    }

    findCallback(target: any, propertyName: string): DefaultValueCallbackMetadata|undefined {
        return this.defaultCallbacks.find(cbmeta => cbmeta.target === target && cbmeta.propertyName === propertyName) ||
            this.defaultCallbacks.find(cbmeta => target.prototype instanceof cbmeta.target && cbmeta.propertyName === propertyName);
    }

    isPropertyExcluded(target: any, propertyName: string): boolean {
        return this.excludedProperties.some(propertyMeta => propertyMeta.target === target && propertyMeta.propertyName === propertyName) ||
            this.excludedProperties.some(propertyMeta => target.prototype instanceof propertyMeta.target && propertyMeta.propertyName === propertyName);
    }
}
