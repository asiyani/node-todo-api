const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let UserSchema = new mongoose.Schema({
    email:{
        type:String,
        minlength:1,
        trim:true,
        required:true,
        unique:true,
        validate: {
            validator:validator.isEmail,   //value => validator.isEmail(value),
            message: '{VALUE} is not a valid Email'
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};


UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decode;
    try {
        decode = jwt.verify(token, 'abc123');
    }catch(e){
       // return new Promise( (resolve,reject) => reject() )
       return Promise.reject();
    }

    return User.findOne({
        '_id':decode._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
}


let User = mongoose.model('User', UserSchema);



module.exports = {User};
