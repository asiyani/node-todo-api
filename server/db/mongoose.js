const myMongoose = require('mongoose');


myMongoose.Promise = global.Promise;
myMongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {myMongoose};