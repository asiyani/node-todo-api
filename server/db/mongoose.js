const myMongoose = require('mongoose');


myMongoose.Promise = global.Promise;
//myMongoose.connect('mongodb://localhost:27017/TodoApp');
myMongoose.connect('mongodb://test:test@ds141128.mlab.com:41128/node-todo-app');


module.exports = {myMongoose};