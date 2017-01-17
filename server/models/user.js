const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs')

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
  var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
  user.tokens.push({access, token});
  return user.save().then(() => {
    return token;
  }).catch( e => console.log(e));;
};

UserSchema.methods.removeToken = function (token) {
        var user = this;
        return user.update({ $pull:{
            tokens:{token}
        }})
}

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decode;
    try {
        decode = jwt.verify(token, process.env.JWT_SECRET);
    }catch(e){
       // return new Promise( (resolve,reject) => reject() )
       return Promise.reject();
    }

    return User.findOne({
        '_id':decode._id,
        'tokens.token':token,
        'tokens.access':'auth'
    });
};

UserSchema.statics.findByCredential  = function(Orinuser) {
    var User = this;
    return User.findOne({email:Orinuser.email}).then( (user) => {
        if(!user)
            return Promise.reject();
        return new Promise( (resolve,reject) => {
                bcrypt.compare(Orinuser.password, user.password, (err, result) => {
                console.log(err,result);
                if(err)
                    return   reject();
                if(result){
                    resolve(user);
                }else{
                    reject();
                }
            })
        })
        
    })
};

UserSchema.pre('save', function (next) {
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password,salt, (err,hashed) =>{
                user.password = hashed;
                next();
            })
        })
    }else{
        next();
    }
});

let User = mongoose.model('User', UserSchema);



module.exports = {User};
