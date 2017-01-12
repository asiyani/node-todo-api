var { MongoClient, ObjectID } = require('mongodb')

console.log(ObjectID('5877db1dcc3c0959b7659ddc').equals(new ObjectID('5877db1dcc3c0959b7659ddc')));


MongoClient.connect( 'mongodb://localhost:27017/TodoApp' , (err, db)=> {
    if(err)
        return console.log('Failed to connect to server', err);


    db.collection("Todos").find().count().then( (count) => {
                                     console.log(`Todos Count:${count}`);
                                        })  
                                        .catch(err => console.log(err));


    db.collection("Todos").find({completed:true}).toArray().then( (docs) => {
                                     console.log('Todos');
                                     console.log(JSON.stringify(docs,undefined,2));
                                        })  
                                        .catch(err => console.log(err));
    db.collection("Todos").find({
                _id: new ObjectID('5877db1dcc3c0959b7659ddc')}).toArray().then( (docs) => {
                                     console.log('Todos by ID');
                                     console.log(JSON.stringify(docs,undefined,2));
                                        })  
                                        .catch(err => console.log(err));


    db.close();

});