export class EntityBuilder {
    /**
     * Build an entity object from source data.
     *
     * @param buildClass
     * @param sourceData
     * @returns {any}
     */
    public static buildOne<T>(buildClass: any, sourceData: Object): T {
        this.checkClassValidity(buildClass);

        const entity: any = new buildClass();
        entity.fromJson(sourceData);

        return entity;
    }

    /**
     * Build multiple entities from an array of source data.
     * @param buildClass
     * @param sourceData
     * @returns {any[]}
     */
    public static buildMany<T>(buildClass: any, sourceData: Object[]): T[] {
        this.checkClassValidity(buildClass);

        return sourceData.map(entityData => this.buildOne<T>(buildClass, entityData));
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
