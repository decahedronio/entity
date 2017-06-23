import {Entity} from '../src/Entity';
import {Type} from '../src/support/Type';

class User extends Entity {
    public name: string = null;
    public email: string = null;
    public daysAvailable: string[] = [];
}

class Address extends Entity {
    public street: string = null;
    public city: string = null;
    public zip: string = null;
    public country: string = null;
}

class UserWithAddress extends User {
    public address: Address = null;
}

class UserWithAnnotatedAddress extends User {
    @Type(Address)
    public address: Address;
}

describe('Entity', () => {
    it('can decode a json payload into an entity', () => {
        const user = new User;

        user.fromJson({
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday']
        });

        expect(user.name).toEqual('Decahedron Technologies Ltd.');
        expect(user.email).toEqual('hello@decahedron.io');
        expect(user.daysAvailable).toEqual(['Monday', 'Wednesday', 'Friday']);
    });

    it('does not decode a nested object', () => {
        const user = new UserWithAddress;

        user.fromJson({
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
            address: {
                street: '20-22 Wenlock Road',
                city: 'London',
                zip: 'N1 7GU',
                country: 'United Kingdom'
            }
        });

        expect(user.address).toBeNull();
    });

    it('decodes an annotated nested object', () => {
        const user = new UserWithAnnotatedAddress();

        user.fromJson({
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
            address: {
                street: '20-22 Wenlock Road',
                city: 'London',
                zip: 'N1 7GU',
                country: 'United Kingdom'
            }
        });

        expect(user.address).toBeDefined();
        expect(user.address.street).toEqual('20-22 Wenlock Road');
        expect(user.address.city).toEqual('London');
        expect(user.address.zip).toEqual('N1 7GU');
        expect(user.address.country).toEqual('United Kingdom');
    });
})