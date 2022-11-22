const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const password = process.env.ENC_KEY;
const iv = process.env.IV;



const encrypt = (plaintext)=> {
    let cipher = crypto.createCipheriv(algorithm,Buffer.from(password),Buffer.from(iv))
    let crypted = Buffer.concat([cipher.update(Buffer.from(plaintext)),cipher.final()]);
    return crypted;
}



const decrypt = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(password), Buffer.from(iv));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'base64')), decipher.final()]);

    return decrpyted.toString();
};

module.exports = {
    encrypt : encrypt,
    decrypt : decrypt
}