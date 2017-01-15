
const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');


let userOneID = new ObjectID();
let usertwoID = new ObjectID();
let users = [{
    _id:userOneID,
    email:'user1@example.com',
    password:'user1pass',
    tokens:[{
        access:'auth',
        token:jwt.sign({_id: userOneID.toHexString(), access:'auth'}, 'abc123').toString()
    }]
},{
    _id:usertwoID,
    email:'user2@example.com',
    password:'user2pass'
}];


let todos = [{
    _id: new ObjectID(),
    text: "1st todos",
    completed:true,
    completedAt:new Date()
}, {
    _id: new ObjectID(),
    text: "2nd todos",
    completed:false
}];

var populateTodos = (done) => {
    Todo.remove({}).then(() => Todo.insertMany(todos))
        .then(() => done())
        .catch(err => done(err));
};

const populateUsers = (done) => {
    User.remove({}).then( () => {
          let  user1 = new User(users[0]).save();
          let  user2 = new User(users[1]).save();
          return Promise.all([user1,user2]);
    }). then ( ()=> done() )
      .catch( e => done(e));
}

module.exports = {todos,populateTodos,users,populateUsers}