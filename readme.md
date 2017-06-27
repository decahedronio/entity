# Decahedron Entity

This package provides a convenient way to decode JSON retrieved from your API or similar, and turning it into a TypeScript class instance.

Each class is self-encoding, which means that it knows how to encode itself. As such, each class should extend the `Entity` class in order to work, as it deals with the heavy lifting. Alternatively, your class may implement its own `fromJson` method.

## Installation
Install the package from NPM under the name `@decahedron/entity`:
```
yarn add @decahedron/entity
```

## Usage
The basic usage is very straightforward: make your class extend `Entity`, and use the `EntityBuilder` to hydrate instances of it:

```typescript
class User extends Entity {
	// We instantiate with null to ensure the property exists
	// at the time of hydration.
    public name: string = null;
    public email: string = null;
}

fetch('https://api.service.com/v1/users/1')
    .then(response => response.Body.json())
    .then(jsonData => Decahedron.Entity.EntityBuilder.buildOne<User>(User, jsonData));
```

You can also build an array of entities:

```typescript
fetch('https://api.service.com/v1/users')
    .then(response => response.Body.json())
    .then(jsonData => Decahedron.Entity.EntityBuilder.buildMany<User>(User, jsonData));
```

### Annotating nested entities

If your endpoint returns a nested object, such as:
```json
{
	"name": "Decahedron Technologies Ltd.",
	"email": "hello@decahedron.io",
	"address": {
		"street": "20-22 Wenlock Road",
		"city": "London",
		"zip": "N1 7GU",
		"country": "United Kingdom"
	}
}
```
The JSON decoding process will _ignore_ the nested object (`address`). This also applies to arrays of objects (but **not** to arrays of primitives, which are automatically decoded).

There are two ways to solve this. The first one is to simply override the `fromJson` method (in fact, this is why we expose the method on the `Entity`, to make it easy to override decoding functionality):
```typescript
class User extends Entity {
    public name: string = null;
    public email: string = null;
    public address: Address = null;
    
    public fromJson(jsonData: any): User {
    	super.fromJson(jsonData);
    	
    	if (jsonData.hasOwnProperty('address')) {
    	    this.address = EntityBuilder.buildOne<Address>(Address, jsonData['address']);
    	}
    	
    	return this;
    }
}
```

However, this is quite verbose. Instead, an `@Type` decorator is provided for nested decoding:

```typescript
class User extends Entity {
    public name: string = null;
    public email: string = null;
    @Type(Address)
    public address: Address = null;
}
```

If your JSON data comes in with another key, you may specify that manually with:
```typescript
@Type(Address, 'json_key')
```

Note that by default, the `@Type` decorator will assume your JSON comes in snake case. As such,
```typescript
@Type(Address)
public homeAddress: Address = null;
```
will assume that the json holds the key `home_address`. If that is not the case, it should be manually specified as the second argument to `@Type`.

### Note about `Object`
If your entity has a nested object that is **not** represented by another entity, you can also use `@Type(Object)` to annotate that the object should simply be stored as is.

## To-do
- [ ] Create an `IEntity` interface that can be implemented