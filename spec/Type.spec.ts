import {Type} from '../src/support/Type';
import {defaultMetadataStorage} from '../src/support/storage';

class Decorated {

}

describe('Decorators - Type', () => {
    describe('Inferred attribute names', () => {
        it('Stores the target type, attribute name and infers the source attribute name', () => {
            let decorator = Type(Decorated);
            let fn = (): null => null;
            decorator(fn, 'attribute');

            let storedMetadata = defaultMetadataStorage.findTypeMetadata(fn.constructor, 'attribute');
            expect(storedMetadata).not.toBeUndefined();
            expect(storedMetadata.propertyName).toEqual('attribute');
            expect(storedMetadata.sourcePropertyName).toEqual('attribute');
            expect(storedMetadata.type).toEqual(Decorated);
        });

        it('Infers that the source name should be snake_case', () => {
            let decorator = Type(Decorated);
            let fn = (): null => null;
            decorator(fn, 'camelAttribute');

            let storedMetadata = defaultMetadataStorage.findTypeMetadata(fn.constructor, 'camel_attribute');
            expect(storedMetadata).not.toBeUndefined();
            expect(storedMetadata.propertyName).toEqual('camelAttribute');
            expect(storedMetadata.sourcePropertyName).toEqual('camel_attribute');
            expect(storedMetadata.type).toEqual(Decorated);
        });
    });

    it('Allows manually overriding the source attribute name', () => {
        let decorator = Type(Decorated, 'camelAttribute');
        let fn = (): null => null;
        decorator(fn, 'camelAttribute');

        let storedMetadata = defaultMetadataStorage.findTypeMetadata(fn.constructor, 'camelAttribute');
        expect(storedMetadata).not.toBeUndefined();
        expect(storedMetadata.propertyName).toEqual('camelAttribute');
        expect(storedMetadata.sourcePropertyName).toEqual('camelAttribute');
        expect(storedMetadata.type).toEqual(Decorated);
    });
});
