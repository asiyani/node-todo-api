var { MongoClient, ObjectID } = require('mongodb')


MongoClient.connect( 'mongodb://localhost:27017/TodoApp' , (err, db)=> {
    if(err)
        return console.log('Failed to connect to server', err);


        //DeleteMany
        db.collection('Todos').deleteMany({text : "new TEXT"}, (err,result) => {
            if(err)
                return console.log('Error occured while deleting ', err);

            console.log('DeleteMany',result.result);
        });


        //DeleteOne
        db.collection('Todos').deleteOne({text:'take test'}).then(result => console.log('DeleteOne',result.result))


        //findOneandDelete
        db.collection('Todos').findOneAndDelete({text:'take test1'})
                                .then( result => console.log('findOneandDelete',result))
                                .catch(err => console.log('findOneandDelete',err));





  
  //  db.close();

});