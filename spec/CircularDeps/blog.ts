import { Entity } from '../../src/Entity';
import { Type } from '../../src/support/Type';
import { Comment } from './comment';

export class BlogPost extends Entity {
    public title: string = null;
    public body: string = null;

    @Type(() => require('./comment').Comment)
    public comments: Comment[] = [];
}
