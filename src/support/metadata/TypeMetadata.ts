export class TypeMetadata {
    constructor(public target: Function,
                public propertyName: string,
                public sourcePropertyName: string,
                public type: Function) {
    }
}
