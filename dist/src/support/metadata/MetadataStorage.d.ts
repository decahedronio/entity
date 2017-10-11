import { TypeMetadata } from './TypeMetadata';
export declare class MetadataStorage {
    private typeMetadatas;
    addTypeMetadata(metadata: TypeMetadata): void;
    findTypeMetadata(target: any, propertyName: string): TypeMetadata;
}
