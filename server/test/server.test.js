const expect = require('expect');
const superTest = require('superTest');
const {ObjectID} = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

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

beforeEach((done) => {
    Todo.remove({}).then(() => Todo.insertMany(todos))
        .then(() => done())
        .catch(err => done(err));
});


describe('Todos', () => {

    it('Should Create new Todo', (done) => {
        let text = 'Testing Todo';
        superTest(app).post('/todos')
            .send({
                text
            })
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