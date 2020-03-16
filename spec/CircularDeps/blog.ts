import { Entity } from '../../src/Entity';
import { Type } from '../../src/support/Type';
import { Comment, CommentAsync } from './comment';

export class BlogPost extends Entity {
    public title: string = null;
    public body: string = null;

    @Type(() => require('./comment').Comment)
    public comments: Comment[] = [];
}

export class BlogPostAsync extends Entity {
    public title: string = null;
    public body: string = null;

    @Type(async () => (await import('./comment')).CommentAsync)
    public comments: CommentAsync[] = [];
}
