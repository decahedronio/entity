import { Buildable, Constructor } from './Type';
import { Entity } from '../Entity';

export function isEntityType(buildable: Buildable): buildable is Constructor<Entity> {
    return buildable?.prototype instanceof Entity;
}
