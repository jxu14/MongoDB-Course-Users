const assert = require('assert');
const User = require('../src/user');

describe('Reading users out of the database', () => {
  let joe, maria, alex, zach;

  beforeEach((done) => {
    alex = new User({ name: 'Alex' });
    joe = new User({ name: 'Joe' });
    maria = new User({ name: 'Maria' });
    zach = new User({ name: 'Zach' });

    //by saving all of these users at once, we
    //have no control of the order in which they're saved

    Promise.all([ alex.save(), joe.save(), maria.save(), zach.save()])
      .then(() => done());
  });

  it('finds all users with a name of joe', (done) => {
    User.find({ name: 'Joe' })
      .then((users) => {
        assert(users[0]._id.toString() === joe._id.toString());
        done();
      });
  });

  it('finds a user with a particular id', (done) => {
    User.findOne({ _id: joe._id })
      .then((user) => {
        assert(user.name === 'Joe');
        done();
      });
  });

  it('can skip and limit the result set', (done) => {
    // -Alex- [Joe Maria] Zach
    User.find({})
    //for the sort modifier, the key (name) is what
    //you're sorting, then the value is in what order.
    //So here we're sorting name in ascending order
    // (1 is ascending and -1 is descending)
    .sort({ name: 1 })
    .skip(1)
    .limit(2)
    //by passing in an empty object, there is basically
    //no filter, so it returns every record in the database
      .then((users) => {
        assert(users.length === 2);
        assert(users[0].name === 'Joe');
        assert(users[1].name === 'Maria');
        done();
      })
  });
});
