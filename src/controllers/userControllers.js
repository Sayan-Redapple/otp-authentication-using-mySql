// const { verify } = require("../libs/passwordLib");
const passwordLib = require("../libs/passwordLib");
const response = require("../libs/responseLib");
const tokenLib = require("../libs/tokenLib");
const jwt = require("jsonwebtoken");

//------------------------------------------------------------To Register the new user-------------------------------------------------------------------------//

let register = async (req, res) => {
  let { dataAPI } = require("../../www/database/db");

  try {
    //-----------------------------------------------Checking whether any field is missing or not--------------------------------------------------------------//

    if (
      !req.body.user_name ||
      !req.body.full_name ||
      !req.body.email_id ||
      !req.body.mobile_no ||
      !req.body.password
    ) {
      res.status(412).send("There are some Information missing");
    }

    //--------------------------------------------To check whether the email already in database or not--------------------------------------------------------//

    let checkExist = await dataAPI.query(
      `SELECT* FROM tbl_user_register WHERE email_id = "${req.body.email_id}"`,
      { type: dataAPI.QueryTypes.SELECT }
    );
    // console.log(checkExist);

    if (checkExist.length > 0) {
      res.status(200).send("Email ID already exist");
    } else {
      //----------------------------------------------------------Creating a Encrypted Password ----------------------------------------------------------------//

      const hash = await passwordLib.hash(req.body.password);

      //-------------------------------------------------------Inserting all the Data in Database--------------------------------------------------------------//

      let createUser = await dataAPI.query(
        `INSERT INTO tbl_user_register (user_name, full_name, email_id, mobile_no, password) VALUES ( "${req.body.user_name}","${req.body.full_name}", "${req.body.email_id}", "${req.body.mobile_no}", "${hash}")`
      );

      //   console.log(createUser);

      res.status(412).send("The User is Registered !! Congratulations !!");
    }
  } catch (err) {
    let apiResponse = response.generate(true, `${err.message}`, null);
    res.status(412).send(apiResponse);
  }
};

//-------------------------------------------Login using Email id to check whether the Account is Active or not------------------------------------------------//

let login = async (req, res) => {
  let { dataAPI } = require("../../www/database/db");

  try {
    //--------------------------------------------To check whether the email already in Database or not--------------------------------------------------------//

    if (!req.body.email_id) {
      res.status(412).send("There are some information missing");
    }
    let checkExistEmail = await dataAPI.query(
      `SELECT email_id FROM tbl_user_register WHERE email_id = "${req.body.email_id}" AND status_update = 'Active'`,
      { type: dataAPI.QueryTypes.SELECT }
    );
    // console.log(checkExistEmail);
    if (checkExistEmail.length > 0) {
      res.status(412).send("Account is Active");
    } else {
      res.status(412).send("Account is not Active");
    }
  } catch (err) {
    let apiResponse = response.generate(true, `${err.message}`, null);
    res.status(412).send(apiResponse);
  }
};

//---------------------------------------------------Generating random 6-digit OTP using (for) loop------------------------------------------------------------//

function generateOTP() {
  let digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

//---------------------------------------------------------Reciving the generated 6-digit OTP------------------------------------------------------------------//

let getOTP = async (req, res) => {
  let { dataAPI } = require("../../www/database/db");
  try {
    if (!req.body.email_id) {
      res.status(412).send("Input Fuild Missing");
    }
    let checkExist = await dataAPI.query(
      `SELECT* FROM  tbl_user_register WHERE email_id = "${req.body.email_id}"`,
      { type: dataAPI.QueryTypes.SELECT }
    );

    if (checkExist.length > 0) {
      let fetchOTP = generateOTP();

      //---------------------------------------------------------INSERT OTP in TABLE---------------------------------------------------------------------------//

      let createUser = await dataAPI.query(
        `INSERT INTO  tbl_otp_details (email_id, otp_generated, expire_at) VALUES ("${req.body.email_id}", "${fetchOTP}", NOW() + INTERVAL 2 MINUTE)`
      );
      // console.log(createUser);

      let fetchData = await dataAPI.query(
        `SELECT expire_at FROM tbl_otp_details WHERE email_id = "${req.body.email_id}" `,
        { type: dataAPI.QueryTypes.SELECT }
      );

      //  let expireDateData = fetchData
      let firstDate = fetchData[0];
      // console.log(firstDate)

      res.send({
        status_code: "0",
        mobile_no: req.body.mobile_no,
        OTP: fetchOTP,
        message: "success",
        ...firstDate,
      });
    } else {
      return res.send({
        status_code: "1",
        message: "something is wrong",
      });
    }
  } catch (err) {
    let apiResponse = response.generate(true, `${err.message}`, null);
    res.status(412).send(apiResponse);
  }
};

//---------------------------------------------------Verifying the OTP and Generating Web Token----------------------------------------------------------------//

extractOTP = async (req, res) => {
  let { dataAPI } = require("../../www/database/db");
  try {
    // let pickOTP = req.body.otp_generated
    if (!req.body.email_id || !req.body.otp_generated) {
      res.status(412).send("Please Fill the Blank Spaces");
    }
    //let pickOTP = req.body.otp_generated;

    let checkExist = await dataAPI.query(
      `SELECT * FROM tbl_otp_details WHERE email_id = "${req.body.email_id}" AND otp_generated = "${req.body.otp_generated}" `,
      { type: dataAPI.QueryTypes.SELECT }
    );

    // console.log(checkExist);

    if (checkExist.length <= 0) {
      res.status(401).send("Email_id does not Exist");
    } else {
      let selectOTP = await dataAPI.query(
        `SELECT otp_generated FROM tbl_otp_details WHERE email_id = "${req.body.email_id}" ORDER BY id DESC LIMIT 1`,
        { type: dataAPI.QueryTypes.SELECT }
      );
      // console.log(selectOTP);
      if (selectOTP[0].otp_generated == req.body.otp_generated) {
        //-----------------------------------------------------Creating WEBTOKEN-----------------------------------------------------------------------------//

        const token = await tokenLib.generateToken(req.body.email_id);
        const email = await tokenLib.verifyClaimWithoutSecret(token);

        let insertData = await dataAPI.query(
          `INSERT INTO tbl_user_login_details(email_id, token_generated) VALUES ("${req.body.email_id}", "${token}")`
        );

      // let extractData = await dataAPI.query(`SELECT * 
      // FROM  tbl_user_register
      // WHERE email_id = "${req,body.email_id}"`, { type: dataAPI.QueryTypes.SELECT })


      
      return res.status(200).send({
          msg: "Logged in!",
          token: token,
        //  ...email,
        });
      } else {
        return res.status(401).send({
          msg: "OTP is Invalid",
        });
      }
    }
  } catch (err) {
    let apiResponse = response.generate(true, `${err.message}`, null);
    res.status(412).send(apiResponse);
  }
};
module.exports = {
  register: register,
  getOTP: getOTP,
  login: login,
  verifyOTP: extractOTP,
};
