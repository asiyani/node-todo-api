const expect = require('expect');
const superTest = require('superTest');
const {ObjectID} = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

let todos = [{
    _id: new ObjectID(),
    text: "1st todos"
}, {
    _id: new ObjectID(),
    text: "2nd todos"
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
        superTest(app).delete(`/todos/${todos[0]._id.toHexString()}`)
                      .expect(200)
                      .expect( res => {
                         expect(res.body.todo.text).toBe(todos[0].text);
                      })
                      .expect( (res) => {
                          Todo.findById(todos[0]._id.toHexString())
                              .then( todo => {
                                  expect(todo).toBe(null);
                              })
                      })
                      .end(done);
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
})