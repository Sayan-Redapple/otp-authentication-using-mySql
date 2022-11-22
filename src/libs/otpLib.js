const MersenneTwisterClass = require('../algo/rng');
const MersenneTwister = new MersenneTwisterClass();

let randomString = (length, chars)=> {
    let mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '123456789';
    if (chars.indexOf('!') > -1) mask += '!@#$%&*_';
    let result = '';
    for (let i = length; i > 0; --i) result += mask[Math.floor(parseInt(MersenneTwister.random() * mask.length))];
    return result;
}
let generateOtp = (length)=>{
    return randomString(parseInt(length),'#');
}
let generatePassword = (length)=>{
    return randomString(parseInt(length),'aA!#');
}


module.exports = {
    randomString : randomString,
    generateOtp : generateOtp,
    generatePassword:generatePassword
}