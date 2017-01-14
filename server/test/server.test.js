const expect = require('expect');
const superTest = require('superTest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

let todos = [{ text:"1st todos"},{ text:"2nd todos"}];

beforeEach( (done) => {
    Todo.remove({}).then( () => Todo.insertMany(todos))
                    .then ( () => done() )
                    .catch( err => done(err));
});


describe('Todos', () => {

    it('Should Create new Todo', (done) => {
        let text = 'Testing Todo';
        superTest(app).post('/todos')
                      .send({text})
                      .expect(200)
                      .expect( (res) => {
                          expect(res.body.text).toBe(text);
                      })
                      .end( (err,res) => {
                          if(err){
                              return done(err);
                          }

                          Todo.find({text:'Testing Todo'}).then( (Todos) => {
                              expect(Todos.length).toBeGreaterThan(0)
                              expect(Todos[0].text).toBe(text);
                              done();
                          })
                          .catch(e => done(e) );

                      });

    });

    it('Should not make Todo on bad request', (done) => {

        let text = "";
        superTest(app).post('/todos')
                      .send({text})
                      .expect(400)
                      .end( (err,res) => {
                          if(err){
                              return done(err);
                          }

                          Todo.find().then( (Todos) => {
                              expect(Todos.length).toBe(2)
                              done();
                          })
                          .catch(e => done(e) );

                      });


    });
});

describe('GET /todos', () => {


    it("should get all todos", (done)=> {
        superTest(app).get('/todos')
                     .expect(200)
                     .expect( (res) => expect(res.body.todos.length).toBe(2))
                     .end(done);
    });

});