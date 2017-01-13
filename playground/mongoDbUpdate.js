var { MongoClient, ObjectID } = require('mongodb')


MongoClient.connect( 'mongodb://localhost:27017/TodoApp' , (err, db)=> {
    if(err)
        return console.log('Failed to connect to server', err);


        //findOneandDelete
        db.collection('Todos').findOneAndUpdate({_id:new ObjectID('587814b6a9f817d16f5d0e78')},
                                            {$set: {completed:true}},{returnOriginal:false})
                                .then( result => console.log('findOneandDelete',result))
                                .catch(err => console.log('findOneandDelete',err));


       db.collection('Users').findOneAndUpdate({_id: new ObjectID('587803f473ad295b44cfaf57')},
                                                {$set:{name:'Ashok Siyani'},$inc:{age:2}},
                                                {returnOriginal:false})
                                                .then( result => console.log(result))
                                                .catch( err => console.log(err));


  
  //  db.close();

});