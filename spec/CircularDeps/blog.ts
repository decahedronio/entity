import { Entity } from '../../src/Entity';
import { Type } from '../../src/support/Type';
import Comment, { CommentAsync } from './comment';

export class BlogPost extends Entity {
    public title: string = null;
    public body: string = null;

    @Type(() => require('./comment'))
    public comments: Comment[] = [];
}

export class BlogPostImport extends Entity {
    public title: string = null;
    public body: string = null;

    @Type(() => import('./comment'))
    public comments: CommentAsync[] = [];
}

export class BlogPostAsync extends Entity {
    public title: string = null;
    public body: string = null;

    @Type(async () => (await import('./comment')).CommentAsync)
    public comments: CommentAsync[] = [];
}
