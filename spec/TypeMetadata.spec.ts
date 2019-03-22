import { Entity } from '../src/Entity';
import { Type } from '../src/support/Type';
import { defaultMetadataStorage } from '../src/support/storage';

class Address extends Entity {
    public street: string = null;
    public city: string = null;
    public zip: string = null;
    public country: string = null;
}

class UserWithRegularNestedEntity extends Entity {
    @Type(Address)
    public address: Address;
}

class UserWithDeferredNestedEntity extends Entity {
    @Type(() => Address)
    public address: Address;
}

class UserWithDeferredObjectOfNestedEntity extends Entity {
    @Type(() => ({ default: Address }))
    public address: Address;
}

class UserWithFaultyDeferredObjectOfNestedEntity extends Entity {
    @Type(() => ({ Address }))
    public address: Address;
}

describe('TypeMetadata', () => {
    it('returns type as is when an entity constructor is given', () => {
        const metadata = defaultMetadataStorage.findTypeMetadata(
            UserWithRegularNestedEntity,
            'address'
        );

        expect(metadata.type).toBe(Address);
    });

    it('resolves type when a resolver function is given', () => {
        const metadata = defaultMetadataStorage.findTypeMetadata(
            UserWithDeferredNestedEntity,
            'address'
        );

        expect(metadata.type).toBe(Address);
    });

    it('resolves type when a resolver function that returns an object is given', () => {
        const metadata = defaultMetadataStorage.findTypeMetadata(
            UserWithDeferredObjectOfNestedEntity,
            'address'
        );

        expect(metadata.type).toBe(Address);
    });

    it('cannot resolve type when a resolver function that returns an object without the "default" key is given', () => {
        const metadata = defaultMetadataStorage.findTypeMetadata(
            UserWithFaultyDeferredObjectOfNestedEntity,
            'address'
        );

        // We expect it to be undefined, because TypeMetadata will see an object
        // and will try to return `.default` but this type definition does not
        // have a "default" key.
        expect(metadata.type).toBeUndefined();
    });
});
