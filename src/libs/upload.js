const fs = require('fs');
const AWS = require('aws-sdk');
var path = require('path');

// Initializing S3 Interface
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY2,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY2
});

const uploadFile = (fileName) => {
    console.log('fileName',fileName);
    return new Promise((resolve, reject) => {
        // read content from the file        
        // const fileContent = fs.readFileSync(fileName);
        // setting up s3 upload parameters
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: Date.now() +fileName.originalname,
            Body: fileName.buffer,
            ACL: 'public-read'          
            
        };
        // Uploading files to the bucket
        s3.upload(params, function(err, data) {
            if (err) {
                console.log("err",err);
                reject(err);
            }
            console.log(`File uploaded successfully. ${data.Location}`);
            resolve(data.Location);
        });
    });
};

module.exports = {
    uploadFile: uploadFile
}