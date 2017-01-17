const expect = require('expect');
const superTest = require('superTest');
const {ObjectID} = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos,populateTodos,users,populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);


describe('Todos', () => {

    it('Should Create new Todo', (done) => {
        let text = 'Testing Todo';
        superTest(app).post('/todos')
            .send({ text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({
                        text: 'Testing Todo'
                    }).then((Todos) => {
                        expect(Todos.length).toBeGreaterThan(0)
                        expect(Todos[0].text).toBe(text);
                        done();
                    })
                    .catch(e => done(e));

            });

    });

    it('Should not make Todo on bad request', (done) => {

        let text = "";
        superTest(app).post('/todos')
            .send({
                text
            })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((Todos) => {
                        expect(Todos.length).toBe(2)
                        done();
                    })
                    .catch(e => done(e));

            });


    });
});

describe('GET /todos', () => {


    it("should get all todos", (done) => {
        superTest(app).get('/todos')
            .expect(200)
            .expect((res) => expect(res.body.todos.length).toBe(2))
            .end(done);
    });

});


describe('GET /todos/:id', () => {

    it('should get correct data ', (done) => {
        superTest(app).get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect( (res) => {
                //expect(res.body.todo.length).toBe(1);
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should get 404 for invalid ID', (done) => {
        superTest(app).get('/todos/12345')
            .expect(404)
            .end(done);
    });

    it('should get 404 for valid ID but no data found ', (done) => {
        superTest(app).get('/todos/12345')
                        .expect(404)
                        .end(done);
    });

});

describe('DELETE /todos/:id', () => {
    it('should DELETE todo from database', (done) => {
        let hexid = todos[1]._id.toHexString();
        superTest(app).delete('/todos/'+hexid)
                      .expect(200)
                      .expect( res => {
                         expect(res.body.todo.text).toBe(todos[1].text);
                      })
                      .end( (err, res) => {
                          if(err){
                              return done(err);
                          }
                          Todo.findById(todos[1]._id.toHexString())
                              .then( todo => {
                                  expect(todo).toNotExist();
                                  done();
                              })
                              .catch( e => done(e) );
                      });
    })

    it('should get 404 for invalid ID', (done) => {
        superTest(app).delete('/todos/12345')
            .expect(404)
            .end(done);
    });

    it('should get 404 for valid ID but no data found ', (done) => {
        superTest(app).delete(`/todos/${(new ObjectID).toHexString()}`)
                        .expect(404)
                        .end(done);
    });
});


describe('PATCH /todos/:id', () => {

    it("Should complete= true and update text ", (done) => {
        superTest(app).patch(`/todos/${todos[1]._id.toHexString()}`)
                        .send({text:"New TEST TEXT",completed:true})
                            .expect(200)
                            .expect( (res) => {
                                expect(res.body.todo.text).toBe("New TEST TEXT");
                                expect(res.body.todo.completedAt).toBeTruthy();
                            })
                            .end( (err,result) => {
                                if(err){
                                    return done(err);
                                }
                                Todo.findById(todos[1]._id.toHexString()).then((todo) => {
                                            expect(todo.text).toBe('New TEST TEXT');
                                            expect(todo.completedAt).toBeTruthy();
                                            done();
                                        })
                                        .catch(e => done(e));
                                                });
    });

    it("Should complete= false  ", (done) => {
        superTest(app).patch(`/todos/${todos[0]._id.toHexString()}`, ( err, res ) =>{
                                    res.send({completed:false});
                                })
                            .expect(200)
                            .expect( (res) => {
                                expect(res.body.todo.completedAt).toBeFalsy();
                            })
                            .end( (err,result) => {
                                if(err){
                                    return done(err);
                                }
                                Todo.findById(todos[0]._id.toHexString()).then((todo) => {
                                            expect(todo.completedAt).toBeFalsy();
                                            done();
                                        })
                                        .catch(e => done(e));
                                                });
    });

});


describe('GET /Users/me', () => {
    it('Should return user if its authenticated', (done) => {
        superTest(app).get('/Users/me').set('x-auth',users[0].tokens[0].token)
                        .expect(200)
                        .expect(res => {
                            expect(res.body.user.email).toBe(users[0].email);
                            expect(res.body.user._id).toBe(users[0]._id.toHexString());
                        })
                        .end( (err) => {
                            if(err)
                                return done(err);
                            done();
                        })
    })

    it('should return 401 if user is not authenticated', (done) => {
         superTest(app).get('/Users/me').set('x-auth',null)
                        .expect(401)
                        .expect(res => {
                            expect(res.body).toEqual({});
                        })
                        .end( (err) => {
                            if(err)
                                return done(err);
                            done();
                        })
    })
    
});

describe('POST /users',() => {
    it('should create user' ,(done) => {
        superTest(app).post('/users').send({
                        email:'test123@email.com',
                        password:'password'
                    })
                    .expect(200)
                    .expect(res => {
                        expect(res.body.email).toBe('test123@email.com');
                        expect(res.body._id).toExist();
                        expect(res.header['x-auth']).toExist();
                    })
                    .end( err =>{
                        if(err)
                            return done(err);
                        User.findOne({email:'test123@email.com'}).then( user =>{
                            expect(user).toExist();
                            expect(user.email).toBe('test123@email.com');
                            expect(user.password).toNotBe('password');
                            done();
                        }).catch( e => done(e));
                    });

    });


    it('should return validation error if request unvalid', (done) =>{
        superTest(app).post('/users').send({email:'test1234@email.com'})
                                .expect(400)
                                .end(done);
    });

    it('Should not create user if email in use', (done) => {
        superTest(app).post('/users').send({
                                email:users[0].email,
                                password:users[0].password})
                                .expect(400)
                                .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login USER and return token', (done) => {
        
        superTest(app).post('/users/login').send({
                                    email:users[1].email,
                                    password:users[1].password
                                })
                                .expect(200)
                                .expect( res => {
                                    expect(res.header['x-auth']).toExist();
                                })
                                .end( (err, res) => {
                                    if(err)
                                        return done(err);
                                    User.findById(users[1]._id).then( user => {
                                        expect(user.tokens[0]).toInclude({
                                            access:'auth',
                                            token:res.headers['x-auth']
                                        });
                                        done();
                                    })
                                    .catch( e => done(e));
                                    
                                });
    });


    it('should reject invalid login ', (done) => {
        
        superTest(app).post('/users/login').send({
                                    email:'unknown@email.com',
                                    password:'password'
                                     })
                                     .expect(400)
                                     .end(done)
    });
});

describe('DELETE /users/me/token', () => {

    it('should send 200 and delete tocken',(done) => {

        superTest(app).delete('/users/me/token').set('x-auth',users[0].tokens[0].token)
                            
         .expect(200)
          .end( (err,res) => {
              if(err)
                return done(err);
              User.findById(users[0]._id).then( user => {
                  expect(user.tokens.length).toBe(0);
                  done();
              }).catch( e => done(e));
          })
    })
});