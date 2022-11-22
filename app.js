const envConf = require('dotenv').config({ debug: process.env.DEBUG });
if (envConf.error) {
    throw envConf.error
} 
const express = require('express');
const app = express();
// const registerValidate = require('')
const fs = require('fs');
// require('./src/controllers/loginController')

require('./www/database/db').startDB(app);
let allowedCorsOrigin = '*'

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.all(allowedCorsOrigin, function(req, res, next) {
  res.header("Access-Control-Allow-Origin", allowedCorsOrigin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,token,key");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  next();
});

//BOOTSTRAP ROUTES START
const routesPath = './src/routes';
fs.readdirSync(routesPath).forEach(function (file) {
    if (~file.indexOf('.js')) {
        let route = require(routesPath + '/' + file);
        console.log(`current file : ${file} route registered : ${JSON.stringify(route)}`);
        route.setRouter(app);
    }
});
 