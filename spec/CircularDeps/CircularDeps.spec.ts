import { BlogPost } from './blog';
import './comment';

describe('Entity with circular dependency', async () => {
    it('decodes an annotated nested object', async () => {
        const blog = new BlogPost();

        await blog.fromJson({
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
