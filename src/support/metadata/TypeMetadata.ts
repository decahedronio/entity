import {
    PackedBuildable,
    Buildable,
    BuildableResolver,
    Typeable,
    Constructor,
} from '../Type';
import { Entity } from '../../Entity';

function isResolverFunction(type: Typeable): type is BuildableResolver {
    // If the object's name is empty, we will assume it's an anonymous function that resolves the actual type.
    return type.name?.length === 0;
}

export class TypeMetadata {
    constructor(
        public target: Constructor<Entity>,
        public propertyName: string,
        public sourcePropertyName: string,
        private _type: Typeable
    ) {}

    public get type(): Buildable
    {
        if (isResolverFunction(this._type)) {
            // Run the function to actually import the module and assign the module
            // to type prop so that the EntityBuilder will actually get an entity
            // constructor, and not a resolver function.
            const resolvedType = (this._type)();

            return TypeMetadata.unpackType(resolvedType);
        }

        return this._type;
    }

    private static unpackType(type: PackedBuildable): Buildable
    {
        // Assuming that deferred type is resolved via a 'require' function,
        // if it is *not* appended by a key, like below...
        // @Type( () => require('./foo') )
        // It will resolve into an object, and since we are no magicians here,
        // this will simply return the default exported item. If the entity
        // class is not exported as default, the 'require' must have a key
        // appended to it like below:
        // @Type( () => require('./foo').Foo )
        if (typeof type === 'object') {
            return type.default;
        }

        return type;
    }
}
