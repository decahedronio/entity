        import {EntityBuilder} from './EntityBuilder';
        import {defaultMetadataStorage} from './support/storage';
        import {TypeMetadata} from './support/metadata/TypeMetadata';
        import {StringHelper} from './support/StringHelper';
        export class Entity {

            /**
             * Parse a generic object into an entity object.
             *
             * @param sourceObject
             * @param jsonObject
             * @returns {T}
             */
            private static jsonParse<T>(sourceObject: T, jsonObject: Object): T {
                for (let key in jsonObject) {
                    if (jsonObject.hasOwnProperty(key)) {
                        const value: any = jsonObject[key];

                        // We shouldn't copy objects to our entity, as the entity
                        // should be responsible for constructing these itself.
                        if (typeof value === 'object' && !(value instanceof Array)) {
                            const metadata = defaultMetadataStorage.findTypeMetadata(sourceObject.constructor, key);
                            if (metadata) {
                                sourceObject[metadata.propertyName] = EntityBuilder.buildOne(metadata.type, value);
                            }

                            continue;
                        }

                        // if we have an array, we check if it contains objects,
                        // in which case the entity itself should be assumed
                        // responsible to construct the array of entities.
                        if (value instanceof Array && value.length > 0 && typeof value[0] === 'object') {
                            const metadata: TypeMetadata = defaultMetadataStorage.findTypeMetadata(sourceObject.constructor, key);

                            if (metadata) {
                                sourceObject[metadata.propertyName] = EntityBuilder.buildMany(metadata.type, value);
                            }

                            continue;
                        }

                        key = StringHelper.toCamel(key);

                        if (sourceObject.hasOwnProperty(key)) {
                            sourceObject[key] = value;
                        }
                    }
                }

                return sourceObject;
            }

            fromJson(jsonData: any): any {
                return Entity.jsonParse(this, jsonData);
            }
}
