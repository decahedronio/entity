/// <reference path="../../Entity.ts" />
namespace Decahedron {
    export namespace Entity {
        export class TypeMetadata {
            constructor(public target: Function,
                        public propertyName: string,
                        public sourcePropertyName: string,
                        public type: Function) {
            }
        }
    }
}
