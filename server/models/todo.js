const mongoose = require('mongoose');


let Todo = mongoose.model('Todo', {
    text:{
        type: String,
        require:true,
        minlength:1,
        trim:true
    },
    completed:{
        type: Boolean,
        default:false
    },
    completedAt:{
        type: Date,
        default:null  //NOT DATE 
    }

});

module.exports = {Todo};