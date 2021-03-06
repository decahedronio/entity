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
import { Entity, EntityBuilder } from '@decahedron/entity';

class User extends Entity {
    // We instantiate with null to ensure the property exists
    // at the time of hydration.
    public name: string = null;
    public email: string = null;
}

fetch('https://api.service.com/v1/users/1')
    .then(response => response.Body.json())
    .then(jsonData => EntityBuilder.buildOne<User>(User, jsonData));
```

You can also build an array of entities:

```typescript
fetch('https://api.service.com/v1/users')
    .then(response => response.Body.json())
    .then(jsonData => EntityBuilder.buildMany<User>(User, jsonData));
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
import { Entity, EntityBuilder } from '@decahedron/entity';

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

#### Note about `Object`
If your entity has a nested object that is **not** represented by another entity, you can also use `@Type(Object)` to annotate that the object should simply be stored as is.

### Encoding back to JSON

Entity objects can also be encoded back to a plain JavaScript Object, or as a JSON string. You can call `toJson()` on any entity to convert it to a plain JS object.

The method defaults to converting your properties to snake case. To prevent this, you can pass `false` as the first argument to `toJson()`. The method also accepts a second boolean argument that lets you specify if the output should instead be as a JSON string. `toJson(true, true)` is identical to `JSON.stringify(toJson(true))`.

### Circular dependency issue

Because Javascript cannot handle circular dependencies, two related entities cannot annotate each other via the ways shown above. Since v2.7.0, Decahedron Entity solves this issue by importing entity classes only when an entity instance is being built. So instead of importing them at top-level (which would not work as expected):

```typescript
/* Blog.ts */
import { Entity, Type } from '@decahedron/entity';
import Comment from './Comment';

export default class Blog extends Entity {
    // ...

    @Type(Comment)
    public comments: Comment[] = null;
}

/* Comment.ts */
import { Entity, Type } from '@decahedron/entity';
import Blog from './Blog';

export default class Comment extends Entity {
    // ...

    @Type(Blog)
    public blog: Blog = null;
}
```

You can now annotate them with an anonymous importer function:

```typescript
/* Blog.ts */
import { Entity, Type } from '@decahedron/entity';

// You still need to import the annotated class to prevent Typescript and your IDE complaining about it.
import Comment from './Comment';

export default class Blog extends Entity {
    // ...

    @Type(() => require('./Comment'))
    public comments: Comment[] = null;
}

/* Comment.ts */
import { Entity, Type } from '@decahedron/entity';
import Blog from './Blog';

export default class Comment extends Entity {
    // ...

    @Type(() => require('./Blog'))
    public blog: Blog = null;
}
```

If you are in a browser environment and you cannot use require, you can instead use `import()`. Make sure you call the async functions of `Entity` and `EntityBuilder` instead.

```typescript

/* Blog.ts */
import { Entity, Type } from '@decahedron/entity';

// You still need to import the annotated class to prevent Typescript and your IDE complaining about it.
import Comment from './Comment';

export default class Blog extends Entity {
    // ...

    @Type(() => import('./Comment'))
    public comments: Comment[] = null;
}

/* Comment.ts */
import { Entity, Type } from '@decahedron/entity';
import Blog from './Blog';

export default class Comment extends Entity {
    // ...

    @Type(() => import('./Blog'))
    public blog: Blog = null;
}

import { EntityBuilder } from '@decahedron/entity';
import Blog from './Blog';

/* somewhere else */
EntityBuilder.buildOneAsync(Blog, json);
EntityBuilder.buildManyAsync(Comment, json);
Blog.fromJsonAsync(json)
```

## To-do
- [ ] Create an `IEntity` interface that can be implemented

## Contributing

Run the build and the tests using the following commands:

```
$ npm run build
$ npm test
```
