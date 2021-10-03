import { Entity } from '../Entity';

export function AliasFor(key?: string) {
    return function (target: Entity, jsonKey: string) {
        Object.defineProperty(target, key, {
            enumerable: true,
            writable: true,
        });

        Object.defineProperty(target, jsonKey, {
            get() {
                return target.getProp(key);
            },
            set(value: any) {
                target.setProp(key, value);
            },
            enumerable: true,
        });
    };
}
