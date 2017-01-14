const myMongoose = require('mongoose');

let env = process.env.NODE_ENV || 'development';

myMongoose.Promise = global.Promise;

if (env === 'development'){
    myMongoose.connect('mongodb://localhost:27017/TodoApp');
}else if (env === 'test'){
    myMongoose.connect('mongodb://localhost:27017/TodoAppTEST');
}else{
    myMongoose.connect('mongodb://test:test@ds141128.mlab.com:41128/node-todo-app');
}




//myMongoose.connect('mongodb://localhost:27017/TodoApp');
//myMongoose.connect('mongodb://test:test@ds141128.mlab.com:41128/node-todo-app');


module.exports = {myMongoose};