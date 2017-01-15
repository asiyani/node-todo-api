const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = "123!"

bcrypt.genSalt(10, (err,salt) => {
    bcrypt.hash(password,salt, (err, hash) => {
        console.log('passowrd hash:',hash);
    });
});

let hashedPassword = '$2a$10$Y1blZjGPnBqmte/BA1Brj.aKG/9EQoq47ygUIFsW6Mks0V/notUSK';

bcrypt.compare(password,hashedPassword,(err,result) =>{
    console.log('compare password',result);
} )

console.log( SHA256('I am a string').toString() );
console.log( SHA256('128938').toString() );

//example data --- 
var data = {
    id:4
};

//THis token is passed to USER
var token = {
    data:data,
    hash:SHA256( JSON.stringify(data) + 'someSecrete').toString()
}

//Man in middle attach
// token.data.id = 5;
// token.hash = SHA256( JSON.stringify(token.data) + 'differntSecreteORnoSecrete').toString()

//TOKEN WE GOT FROM USER
var resultHash = SHA256( JSON.stringify(token.data) + 'someSecrete').toString();

if (resultHash === token.hash){
    console.log('Token valid we can trust user');
}else{
    console.log('Token invalid DONOT trust user');
}


//**********      JWT   */

var data1 = {
    id:10
}

var token = jwt.sign(data1, 'abc123');
console.log(token);

var decode = jwt.verify(token, 'abc123');
console.log(decode, new Date(decode.iat));