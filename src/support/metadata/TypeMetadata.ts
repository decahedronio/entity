export class TypeMetadata {
    constructor(public target: Function,
                public propertyName: string,
                public sourcePropertyName: string,
                private _type: Function | Promise<Function>) {
    }

    public get type(): Promise<Function> | Function
    {
        // If type name is empty, we will assume it returns a resolver function.
        const typePromise = this._type as Promise<Function>;
        const typeFunction = this._type as Function;
        if (typePromise.then || !typeFunction.name.length) {
            return this.resolveDeferredType();
        }

        return this._type;
    }

    private async resolveDeferredType(): Promise<Function>
    {
        // Run the function to actually import the module and assign the module
        // to type prop so that the EntityBuilder will actually get an entity
        // constructor, and not a resolver function.
        const type = await (await this._type)();

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
