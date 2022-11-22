
const http = require('http');

const startServer = (app) => {
    const server = http.createServer(app);

    server.listen(process.env.REST_PORT);

    server.on('listening',()=>{
        console. log(`Server Listening on PORT : ${server.address().port}`);
    });

    server.on('error',(err)=>{
        console.log(`Server is not Open :: ${err}`);
    })
};

module.exports = {
    startServer:startServer
}

