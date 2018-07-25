const mongoose = require('mongoose');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Associations', () => {
  //make sure all three variables are lowercase
  //the capital BlogPost and Comment (above) are
  //the model classes, which lowercase is just
  //and instance of the class
  let joe, blogPost, comment;
  beforeEach((done) =>
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({ title: 'JS is Great', content: 'Yep it really is' });
    comment = new Comment({ content: 'Congrats on each comment' });

    //ObjectId type refers to this blogPost in the user schema
    joe.blogPosts.push(blogPost);
    blogPost.comments.push(comment);
    comment.user = joe;
  });
});
