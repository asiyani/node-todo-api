require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


const {myMongoose} = require('./db/mongoose');
const {Todo}  = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

let port = process.env.PORT;

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


//****************USER ROUTERS****************** */

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.post('/users/login',( req,res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredential(body).then( user => {
                                    return user.generateAuthToken().then( (token) => {
                                                    res.header('x-auth', token).send(user);
                                              })
                                })                               
                            .catch( err => res.status(401).send());
});



app.get('/users/me', authenticate,  (req,res) => {
    res.send({user:req.user});
});



app.listen(port, () => console.log('Started on port '+port));


module.exports = {app};



