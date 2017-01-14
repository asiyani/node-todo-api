const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');


const {myMongoose} = require('./db/mongoose');
const {Todo}  = require('./models/todo');
const {User} = require('./models/user');



let app = express();
app.use(bodyParser.json()); 



app.post('/todos', (req,res) => {
    console.log(req.body);
    let newTodo = new Todo(req.body);
    newTodo.save().then( (result)=> res.send(result) )
                  .catch( (err) => res.status(400).send(err));

});

app.get('/todos', (req,res) => {
    
    Todo.find().then( (todos) => res.send({todos}))
               .catch( err => res.status(400).send(e));
});

app.get('/todos/:id' , (req,res) => {
    let id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send(); 
    }

    Todo.findById(id).then( (result) => {
                    if(!result)
                        return res.status(404).send();
                    res.send({todo:result});
                })
                .catch( (err) => res.status(400).send(err));



});











app.listen(3000, () => console.log('Started on port 3000'));


module.exports = {app};



