const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Associations', () => {
  //make sure all three variables are lowercase
  //the capital BlogPost and Comment (above) are
  //the model classes, which lowercase is just
  //and instance of the class
  let joe, blogPost, comment;
  beforeEach((done) => {
    joe = new User({ name: 'Joe' });
    blogPost = new BlogPost({ title: 'JS is Great', content: 'Yep it really is' });
    comment = new Comment({ content: 'Congrats on great post' });

    joe.blogPosts.push(blogPost);
    blogPost.comments.push(comment);
    comment.user = joe;

    Promise.all([joe.save(), blogPost.save(), comment.save()])
      .then(() => done());
  });

  it('saves a relation between a user and a blogpost', (done) => {
    User.findOne({ name: 'Joe' })
      .populate('blogPosts')
      .then((user) => {
        assert(user.blogPosts[0].title === 'JS is Great')
        done();
      });
  });

  it('saves a full relation graph', (done) => {
    User.findOne({ name: 'Joe' })
      .populate({
        //in this user, find the blogPost property
        //and load up all the associated blogPosts
        path: 'blogPosts',
        populate: {
          //inside of all those blogPosts you just fetched,
          //find the comments property and load up
          //all the associated comments
          path: 'comments',
          //when you load up the comments, use the comment
          // model
          model: 'comment',
          populate: {
            //show another more  deeply nested association
            //find the user property inside the comment
            //and load up the associated user
            path: 'user',
            model: 'user'
          }
        }
      })
      .then((user) => {
        assert(user.name === 'Joe');
        assert(user.blogPosts[0].title === 'JS is Great');
        assert(user.blogPosts[0].comments[0].content === 'Congrats on great post');
        assert(user.blogPosts[0].comments[0].user.name === 'Joe');

        done();
      })
  });
});
