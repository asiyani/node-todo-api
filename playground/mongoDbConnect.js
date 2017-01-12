const { MongoClient, ObjectID } = require('mongodb');

// let obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(error, db) => {

    if(error){
       return console.log('unable to connect to MongoDb Server');
    }
    console.log('connected to MongoDb server');


    // db.collection('Todos').insertOne( {text:"new TEXT",completed:false} ,(error,result) => {
    //     if(error){
    //         return console.log('unable to insert Todos',error);
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,2));
    // })


    // db.collection('Users').insertOne( { name:'ashok',age:32,location:'UK'}, (error,result) => {
    //     if(error)
    //         return console.log('Error while inserting data in Users',error);
    //     console.log(JSON.stringify(result.ops,undefined,2));
    //     console.log(result.ops[0]._id.getTimestamp().toString());
    // });




    db.close();
});
