import { BlogPost } from './blog';
import './comment';

describe('Entity with circular dependency', () => {
    it('decodes an annotated nested object', () => {
        const blog = new BlogPost();

        blog.fromJson({
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
