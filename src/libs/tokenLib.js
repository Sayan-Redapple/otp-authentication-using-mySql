const jwt = require('jsonwebtoken');
const shortid = require('shortid');
const secretKey = process.env.ENC_KEY;
const time = require('./timeLib');
// const config = require('../../config/appConfig');



let generateToken = (data) => {
  return new Promise((resolve,reject)=>{
    try{
      let claims = {
        jwtid: shortid.generate(),
        iat: Date.now(),
        // exp: Math.floor(Date.now()/1000) + config.sessionExpTime,
        sub: 'auth_token',
        data: data
      }
      resolve(jwt.sign(claims, secretKey));      
    }catch(err){
      reject(err);
    }
  });
}
let verifyClaim = (token,secret,cb) => {
  // verify a token symmetric
  jwt.verify(token, secret, function (err, decoded) {
    if(err){
      cb(err,null)
    }
    else{
      cb(null,decoded);
    }
   });
}// end verify claim 

let verifyClaimWithoutSecret = (token) => {
  return new Promise((resolve,reject)=>{
    jwt.verify(token, secretKey, function (err, decoded) {
      if(err){
        reject(err)
      }
      else{
        resolve(decoded);
      }  
    });
  })
}
module.exports = {
  generateToken: generateToken,
  verifyToken :verifyClaim,
  verifyClaimWithoutSecret :verifyClaimWithoutSecret
}
