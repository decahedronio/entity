import { Entity } from '../../src/Entity';
import { Type } from '../../src/support/Type';
import { BlogPost, BlogPostAsync } from './blog';

export default class Comment extends Entity {
    public body: string = null;

    @Type(() => require('./blog').BlogPost)
    public blog: BlogPost = null;
}

export class CommentAsync extends Entity {
    public body: string = null;

    @Type(async () => (await import('./blog')).BlogPostAsync)
    public blog: BlogPostAsync = null;
}
