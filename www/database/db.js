let server = require('../rest/server');
let dataAPI;

const startDB = (app)=>{
    switch(process.env.DATABASE){
        case "mysql":
            //Import the sequelize module
            const { Sequelize } = require('sequelize');

            const dbConfig = require("../../config/dbConfig.json")[process.env.NODE_ENV];

            dataAPI = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
            try{
                dataAPI.authenticate()
                .then(()=>{
                    console.log(`Database Connection open Success : ${JSON.stringify(dbConfig.host)}`);
                    module.exports.dataAPI = dataAPI;
                    server.startServer(app);
                });
            }catch(err){
                console.log(`Database Connection Open Error : ${err}`);
            }

            break;
  
        default:
            //default server
            console.log('No Database Connected,webserver starting!');
            server.startServer(app);

    }
}

module.exports = {
    startDB:startDB
}