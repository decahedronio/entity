import { isEntityType } from '../../src/support/isEntityType';
import { Entity } from '../../src/Entity';

describe('isEntityType', () => {
    class Vehicle extends Entity {}

    it('should return true for classes that extend Entity class', () => {
        expect(isEntityType(Vehicle)).toBe(true);
    });

    // This test implicitly tests that the function does not throw errors.
    it('should return false for non-class values', () => {
        // @ts-ignore
        expect(isEntityType(1)).toBe(false);
        // @ts-ignore
        expect(isEntityType('some text')).toBe(false);
        // @ts-ignore
        expect(isEntityType(true)).toBe(false);
        // @ts-ignore
        expect(isEntityType(Number.NaN)).toBe(false);
        // @ts-ignore
        expect(isEntityType(null)).toBe(false);
        // @ts-ignore
        expect(isEntityType(undefined)).toBe(false);
        // @ts-ignore
        expect(isEntityType()).toBe(false);
    });

    it('should return false for instances of entity classes', () => {
        // @ts-ignore
        expect(isEntityType(new Vehicle())).toBe(false);
    });
})
