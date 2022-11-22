const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const response = require('./responseLib');
const appConfig = require('../../config/appConfig');


let sendSMS = (params) => {
    return new Promise((resolve,reject) => {
        let sns = new appConfig.AWS.SNS();
        let publishTextPromise = sns.publish(params).promise();
    
        publishTextPromise.then(
             (data) => {
                console.log(JSON.stringify({ MessageID: data}));
                resolve(data)
            }).catch(
                 (err) => {
                    console.log(JSON.stringify({ Error: err }));
                    reject(err)
                });
    
    })

}

let sendEmailOtp = (options)=>{
         return new Promise((resolve,reject)=>{
              
              let mailOptions = {
                  from: process.env.APP_EMAIL,
                  to: options.communication_details,
                  subject: 'OTP Validation Mail From Game Engine',
                  text: `OTP : ${options.otp}`
                };
              
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                    let apiResponse = response.generate(true, error.message, 0, null)
                    reject(apiResponse)
                  } else {
                    console.log('Email sent: ' + info.response);
                    let apiResponse = response.generate(false, 'Otp sent successfully', 1, JSON.stringify({user_id:options.user_id}))
                    resolve(apiResponse)
                  }
                }); 
         })
}
let sendEmailResetPasswordLink = (options)=>{
  return new Promise((resolve,reject)=>{
       
       let mailOptions = {
           from: process.env.APP_EMAIL,
           to: options.communication_details,
           subject: 'Password Reset Link from Poker Engine',
           text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +  
           'Please click on the following link, or paste this into your browser to complete the process:\n\n' +  
           'http://' + options.uri + appConfig.apiVersion +'/reset/' + options.token + '\n\n' +  
           'If you did not request this, please ignore this email and your password will remain unchanged.\n'  
         };
       
         transporter.sendMail(mailOptions, function(error, info){
           if (error) {
             console.log(error);
             let apiResponse = response.generate(true, error.message, 0, null)
             reject(apiResponse)
           } else {
             console.log('Email sent: ' + info.response);
             let apiResponse = response.generate(false, 'Link sent to Registered Mail successfully', 1, null)
             resolve(apiResponse)
           }
         }); 
  })
}

let sendEmailResetPasswordConfirmation = (options)=>{
  return new Promise((resolve,reject)=>{
       
       let mailOptions = {
           from: process.env.APP_EMAIL,
           to: options.communication_details,
           subject: 'ATTENTION : HeartsFantasy password has been changed',
           text: 'Hello,\n\n' +  
           'This is a confirmation that the password for your account : ' + options.communication_details + ' has just been changed.\n'   
         };
       
         transporter.sendMail(mailOptions, function(error, info){
           if (error) {
             console.log(error);
             let apiResponse = response.generate(true, error.message, 0, null)
             reject(apiResponse)
           } else {
             console.log('Email sent: ' + info.response);
             let apiResponse = response.generate(false, 'Password reset successfully and a confirmation mail sent to registered mail', 1, null)
             resolve(apiResponse)
           }
         }); 
  })
}

let sendPushNotification = (message) => {
  admin.messaging().send(message).then((response)=>{
    console.log("successfully sent push message",response);
  }).catch((err)=>{
    console.log("error sending push",err);
  })
}


module.exports = {
    sendEmailOtp :sendEmailOtp,
    sendEmailResetPasswordLink :sendEmailResetPasswordLink,
    sendEmailResetPasswordConfirmation :sendEmailResetPasswordConfirmation,
    sendSMS:sendSMS,
    sendPushNotification:sendPushNotification
}