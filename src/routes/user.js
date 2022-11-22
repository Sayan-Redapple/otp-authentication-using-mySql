const userController = require('../controllers/userControllers');




let setRouter = (app) => {

    let baseUrl = `${process.env.BASEURL}`;

    app.post(`${baseUrl}/register`,userController.register);
    app.post(`${baseUrl}/login`,userController.login);
    app.post(`${baseUrl}/getOTP`,userController.getOTP);
    app.post(`${baseUrl}/verifyOTP`,userController.verifyOTP);
    
    



}


module.exports = {
    setRouter:setRouter
}



