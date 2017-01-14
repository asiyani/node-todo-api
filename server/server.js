const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');


const {myMongoose} = require('./db/mongoose');
const {Todo}  = require('./models/todo');
const {User} = require('./models/user');

let port = process.env.PORT || 3000;

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


app.delete('/todos/:id' , (req,res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send(); 
    }

    Todo.findOneAndRemove({_id:id}).then( (result) => {
                    if(!result)
                        return res.status(404).send();
                    res.send({todo:result});  
                })
                .catch( (err) => res.status(400).send(err));
});

app.patch('/todos/:id' , (req,res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text','completed']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send(); 
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date();
    }else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id:id},{$set:body},{new:true}).then( (result) => {
                    if(!result)
                        return res.status(404).send();
                    res.send({todo:result})
                })
                .catch( (err) => res.status(400).send(err));
});



app.listen(port, () => console.log('Started on port '+port));


module.exports = {app};



