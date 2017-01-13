const expect = require('expect');
const superTest = require('superTest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');


beforeEach( (done) => {
    Todo.remove({}).then ( () => done() )
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

                          Todo.find().then( (Todos) => {
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
                              expect(Todos.length).toBe(0)
                              done();
                          })
                          .catch(e => done(e) );

                      });


    });



});