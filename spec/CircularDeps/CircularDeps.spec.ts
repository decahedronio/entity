import { BlogPost, BlogPostAsync } from './blog';
import './comment';
import { EntityBuilder } from '../../src/EntityBuilder';

describe('Entity with circular dependency', () => {
    it('decodes an annotated nested object', async () => {
        const blog = await EntityBuilder.buildOne(BlogPost, {
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

    it('decodes an annotated nested object async', async () => {
        const blog = await EntityBuilder.buildOne(BlogPostAsync, {
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
});
