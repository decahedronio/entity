import { EntityBuilder } from '../src/EntityBuilder';
import { Entity } from '../src/Entity';
import { Type } from '../src/support/Type';
import { JsonExclude } from '../src/support/JsonExclude';

class User extends Entity {
    public name: string = undefined;
    public email: string = undefined;
    public daysAvailable: string[] = [];
}

class Address extends Entity {
    public street: string = null;
    public city: string = null;
    public zip: string = null;
    public country: string = null;
}

class Post extends Entity {
    public title: string = null;
    public content: string = null;
}

class UserWithAddress extends User {
    public address: Address = null;
}

class UserWithAnnotatedAddress extends User {
    @Type(Address)
    public address: Address;
}

class UserWithAnnotatedPosts extends User {
    @Type(Post)
    public posts?: Post[];
}

class UserWithAnnotatedObject extends User {
    @Type(Object)
    public address: { [key: string]: string };
}

class UserWithExcludedOutput extends User {
    @JsonExclude()
    public value: string = 'test';
}

describe('EntityBuilder', () => {
    it('can decode a json payload into an entity', async () => {
        const user = EntityBuilder.buildOne(User, {
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
        });

        expect(user.name).toEqual('Decahedron Technologies Ltd.');
        expect(user.email).toEqual('hello@decahedron.io');
        expect(user.daysAvailable).toEqual(['Monday', 'Wednesday', 'Friday']);
    });

    it('decodes a non-annotated nested object as POJO', async () => {
        const user = EntityBuilder.buildOne(UserWithAddress, {
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
            address: {
                street: '20-22 Wenlock Road',
                city: 'London',
                zip: 'N1 7GU',
                country: 'United Kingdom',
            },
        });

        expect(user.address).toMatchObject({
            street: '20-22 Wenlock Road',
            city: 'London',
            zip: 'N1 7GU',
            country: 'United Kingdom',
        });
    });

    it('decodes an annotated nested object', async () => {
        const user = EntityBuilder.buildOne(UserWithAnnotatedAddress, {
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
            address: {
                street: '20-22 Wenlock Road',
                city: 'London',
                zip: 'N1 7GU',
                country: 'United Kingdom',
            },
        });

        expect(user.address).toBeDefined();
        expect(user.address.street).toEqual('20-22 Wenlock Road');
        expect(user.address.city).toEqual('London');
        expect(user.address.zip).toEqual('N1 7GU');
        expect(user.address.country).toEqual('United Kingdom');
    });

    it('decodes an annotated optional nested array object', async () => {
        const user = EntityBuilder.buildOne(UserWithAnnotatedPosts, {
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
            posts: [{
                title: 'About',
                content: 'Lorem ipsum dolor sit amet',
            }],
        });

        expect(user.posts).toBeDefined();
        expect(user.posts[0]).toBeDefined();
        expect(user.posts[0].title).toEqual('About');
        expect(user.posts[0].content).toEqual('Lorem ipsum dolor sit amet');
    });

    it('decodes an annotated optional nested array object to empty array', async () => {
        const user = EntityBuilder.buildOne(UserWithAnnotatedPosts, {
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
            posts: [],
        });

        expect(user.posts).toBeDefined();
        expect(user.posts).toEqual([]);
    });

    it('can decode an annotated Object, without being an entity', async () => {
        const user = EntityBuilder.buildOne(UserWithAnnotatedObject, {
            name: 'Decahedron Technologies Ltd',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
            address: {
                street: '20-22 Wenlock Road',
                city: 'London',
                zip: 'N1 7GU',
                country: 'United Kingdom',
            },
        });

        expect(user.address).toBeDefined();
        expect(user.address['street']).toEqual('20-22 Wenlock Road');
        expect(user.address['city']).toEqual('London');
        expect(user.address['zip']).toEqual('N1 7GU');
        expect(user.address['country']).toEqual('United Kingdom');
    });

    it('can encode itself to a plain object', async () => {
        const user = EntityBuilder.buildOne(User, {
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
        });

        expect(user.toJson())
            .toEqual({
                name: 'Decahedron Technologies Ltd.',
                email: 'hello@decahedron.io',
                days_available: ['Monday', 'Wednesday', 'Friday'],
            });
    });

    it('can encode itself to a plain object while maintaining camelCase', async () => {
        const user = EntityBuilder.buildOne(User, {
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
        });

        expect(user.toJson(false))
            .toEqual({
                name: 'Decahedron Technologies Ltd.',
                email: 'hello@decahedron.io',
                daysAvailable: ['Monday', 'Wednesday', 'Friday'],
            });
    });

    it('can encode itself to a plain object and convert to a json string', async () => {
        const user = EntityBuilder.buildOne(User, {
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
        });

        expect(user.toJson(true, true))
            .toEqual(JSON.stringify({
                name: 'Decahedron Technologies Ltd.',
                email: 'hello@decahedron.io',
                days_available: ['Monday', 'Wednesday', 'Friday'],
            }));
    });

    it('can encode itself to a plain object and convert to a json string without converting to snake case', async () => {
        const user = EntityBuilder.buildOne(User, {
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
        });

        expect(user.toJson(false, true))
            .toEqual(JSON.stringify({
                name: 'Decahedron Technologies Ltd.',
                email: 'hello@decahedron.io',
                daysAvailable: ['Monday', 'Wednesday', 'Friday'],
            }));
    });

    it('can encode itself and its children to a plain object', async () => {
        const user = EntityBuilder.buildOne(UserWithAnnotatedAddress, {
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
            address: {
                street: '20-22 Wenlock Road',
                city: 'London',
                zip: 'N1 7GU',
                country: 'United Kingdom',
            },
        });

        expect(user.toJson())
            .toEqual({
                name: 'Decahedron Technologies Ltd.',
                email: 'hello@decahedron.io',
                days_available: ['Monday', 'Wednesday', 'Friday'],
                address: {
                    street: '20-22 Wenlock Road',
                    city: 'London',
                    zip: 'N1 7GU',
                    country: 'United Kingdom',
                },
            });
    });

    it('can encode itself and its array children to a plain object', async () => {
        const user = EntityBuilder.buildOne(UserWithAnnotatedPosts, {
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
            posts: [{
                title: 'About',
                content: 'Lorem ipsum dolor sit amet',
            }],
        });

        expect(user.toJson())
            .toEqual({
                name: 'Decahedron Technologies Ltd.',
                email: 'hello@decahedron.io',
                days_available: ['Monday', 'Wednesday', 'Friday'],
                posts: [{
                    title: 'About',
                    content: 'Lorem ipsum dolor sit amet',
                }],
            });
    });

    it('should preserve null values for annotated attributes', async () => {
        const user = EntityBuilder.buildOne(UserWithAnnotatedAddress, {
            name: 'Decahedron Technologies Ltd.',
            email: 'hello@decahedron.io',
            days_available: ['Monday', 'Wednesday', 'Friday'],
            address: null,
        });

        expect(user.toJson())
            .toEqual({
                name: 'Decahedron Technologies Ltd.',
                email: 'hello@decahedron.io',
                days_available: ['Monday', 'Wednesday', 'Friday'],
                address: null,
            });
    });

    it('should preserve null values for non-annotated attributes', async () => {
        const user = EntityBuilder.buildOne(UserWithAnnotatedAddress, {
            name: 'Decahedron Technologies Ltd.',
            email: null,
            days_available: ['Monday', 'Wednesday', 'Friday'],
            address: {
                street: '20-22 Wenlock Road',
                city: 'London',
                zip: 'N1 7GU',
                country: 'United Kingdom',
            },
        });

        expect(user.toJson())
            .toEqual({
                name: 'Decahedron Technologies Ltd.',
                email: null,
                days_available: ['Monday', 'Wednesday', 'Friday'],
                address: {
                    street: '20-22 Wenlock Road',
                    city: 'London',
                    zip: 'N1 7GU',
                    country: 'United Kingdom',
                },
            });
    });

    it('excludes @JsonExclude annotated keys from the output object', () => {
        const user = new UserWithExcludedOutput();
        user.name = 'Batman';
        user.email = 'noreply@batman.example.com';

        const output = user.toJson();
        expect(output.value).toBeUndefined();
    });
});
