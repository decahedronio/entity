export class EntityBuilder {

    public static enableCamelConversion = true;

    /**
     * Build an entity object from source data.
     *
     * @param buildClass
     * @param sourceData
     * @returns {any}
     */
    public static async buildOne<T>(buildClass: any, sourceData: Object): Promise<T | any> {
        this.checkClassValidity(await buildClass);

        if ((await buildClass) === Object) {
            return sourceData;
        }

        const entity: any = new (await buildClass)();
        await entity.fromJson(sourceData);

        return entity;
    }

    /**
     * Build multiple entities from an array of source data.
     * @param buildClass
     * @param sourceData
     * @returns {any[]}
     */
    public static async buildMany<T>(buildClass: any, sourceData: Object[]): Promise<T[]> {
        this.checkClassValidity(await buildClass);

        return Promise.all(sourceData.map(entityData => this.buildOne<T>(buildClass, entityData)));
    }

    public static convertToCamel(convert = true) {
        this.enableCamelConversion = convert;
    }

    /**
     * Check if a valid class was passed through.
     *
     * @param className
     */
    private static checkClassValidity(className: any) {
        if (typeof className !== 'function') {
            throw new Error('Class could not be found');
        }
    }
}
