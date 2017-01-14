const {Todo} = require('./../server/models/todo');
const {myMongoose} = require('./../server/db/mongoose');


let id = '687a090c9af7ab10b657c22f';

Todo.find({_id:id}).then( result => console.log(result));


Todo.findOne({_id:id}).then( result => console.log(result));


Todo.findById(id).then( result => console.log(result));