"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Type_1 = require("../src/support/Type");
var storage_1 = require("../src/support/storage");
var Decorated = (function () {
    function Decorated() {
    }
    return Decorated;
}());
describe('Decorators - Type', function () {
    describe('Inferred attribute names', function () {
        it('Stores the target type, attribute name and infers the source attribute name', function () {
            var decorator = Type_1.Type(Decorated);
            var fn = function () { return null; };
            decorator(fn, 'attribute');
            var storedMetadata = storage_1.defaultMetadataStorage.findTypeMetadata(fn.constructor, 'attribute');
            expect(storedMetadata).not.toBeUndefined();
            expect(storedMetadata.propertyName).toEqual('attribute');
            expect(storedMetadata.sourcePropertyName).toEqual('attribute');
            expect(storedMetadata.type).toEqual(Decorated);
        });
        it('Infers that the source name should be snake_case', function () {
            var decorator = Type_1.Type(Decorated);
            var fn = function () { return null; };
            decorator(fn, 'camelAttribute');
            var storedMetadata = storage_1.defaultMetadataStorage.findTypeMetadata(fn.constructor, 'camel_attribute');
            expect(storedMetadata).not.toBeUndefined();
            expect(storedMetadata.propertyName).toEqual('camelAttribute');
            expect(storedMetadata.sourcePropertyName).toEqual('camel_attribute');
            expect(storedMetadata.type).toEqual(Decorated);
        });
    });
    it('Allows manually overriding the source attribute name', function () {
        var decorator = Type_1.Type(Decorated, 'camelAttribute');
        var fn = function () { return null; };
        decorator(fn, 'camelAttribute');
        var storedMetadata = storage_1.defaultMetadataStorage.findTypeMetadata(fn.constructor, 'camelAttribute');
        expect(storedMetadata).not.toBeUndefined();
        expect(storedMetadata.propertyName).toEqual('camelAttribute');
        expect(storedMetadata.sourcePropertyName).toEqual('camelAttribute');
        expect(storedMetadata.type).toEqual(Decorated);
    });
});
//# sourceMappingURL=Type.spec.js.map