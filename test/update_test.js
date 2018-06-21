const assert = require('assert');
const User = require('../src/user');

describe('Updating records', () => {
  let joe;

  beforeEach((done) => {
    joe = new User({ name: 'Joe' });
    joe.save()
      .then(() => done());
  });

  function assertName(operation, done) {
    operation
      .then(() => User.find({}))
      .then((users) => {
        assert(users.length === 1);
        assert(users[0].name === 'Alex');
        done();
      });
  }

  //do updates over time, not all at once
  it('instance type using set n save', (done) => {
    joe.set('name', 'Alex');
    assertName(joe.save(), done);
  });

  //same as set n save, but over one go, save everything at once
  it('A model instance can update', (done) => {
    assertName(joe.update({ name: 'Alex' }), done);
  });

  it('A model class can update', (done) => {
    assertName(
      User.update({ name: 'Joe' }, { name: 'Alex' }),
      done
    );

  })

  it('A model class can update one record', (done) => {
    assertName(
      User.findOneAndUpdate({ name: 'Joe' }, { name: 'Alex' }),
      done
    );
  })

  it('A model class can find a record with a Id and update', (done) => {
    assertName(
      User.findByIdAndUpdate(joe._id, { name: 'Alex'}),
      done
    );
  })

  it('A user can have their post count incremented by 1', (done) => {
    User.update( { name: 'Joe' }, { $inc: { postCount: 1 } })
      .then(() => User.findOne({ name: 'Joe' }))
      .then((user) => {
        assert(user.postCount === 1);
        done();
      })
  })
});