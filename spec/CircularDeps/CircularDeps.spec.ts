import { BlogPost } from './blog';
import Comment from './comment';
import { EntityBuilder } from '../../src/EntityBuilder';

describe('Entity with circular dependency', () => {
    it('decodes circularly depended annotated entity', () => {
        const blog = EntityBuilder.buildOne(BlogPost, {
            title: 'Decahedron/Entity gets circdep',
            body: 'hooray!',
            comments: [
                { body: 'Yay!' },
            ],
        });

        expect(blog.comments).toBeDefined();
        expect(blog.comments[0]).toBeDefined();
        expect(blog.comments[0].body).toEqual('Yay!');
    });

    it('decodes circularly depended annotated entity other way around', () => {
        const comment = EntityBuilder.buildOne(Comment, {
            body: 'hooray!',
            blog: {
                title: 'Decahedron/Entity gets circdep',
                body: 'hooray!',
            },
        });

        expect(comment.blog).toBeDefined();
        expect(comment.blog.body).toEqual('hooray!');
    });
});
