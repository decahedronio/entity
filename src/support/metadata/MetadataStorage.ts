import {TypeMetadata} from './TypeMetadata';

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

    /**
     * Append type metadata.
     *
     * @param metadata
     */
    addTypeMetadata(metadata: TypeMetadata) {
        this.typeMetadatas.push(metadata);
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
            meta.target === target && meta.sourcePropertyName === propertyName
        );

        const metadataFromChildren = this.typeMetadatas.find(meta => 
            target.prototype instanceof meta.target && meta.sourcePropertyName === propertyName
        );

        return metadataFromTarget || metadataFromChildren;
    }
}
