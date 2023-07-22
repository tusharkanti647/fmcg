const jwt = require("jsonwebtoken");
const secretKey = process.env.KEY;


//To check a password between 8 to 15 characters which contain at least one lowercase letter,
// one uppercase letter, one numeric digit, and one special character
const passwordValidation = (password) => {
    var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    return regex.test(password);
}
//email validation
const mailValidation = (mail) => {
    var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(mail);
}

//indian mobile number validation
const numberValidation = (pNumber) => {
    var regex = /^(0|91)?[6-9][0-9]{9}$/;
    return regex.test(pNumber);
}

//generate token 
//-----------------------------------------------
async function generateAuthToken(id) {
    try {
        //first creat a paylod
        const paylod = {
            _id: id,
        }

        //create token
        token = jwt.sign(paylod, secretKey, { expiresIn: "1d" });
        return token;
    } catch (err) {
        console.log(err);
    }
}


module.exports={passwordValidation, mailValidation, numberValidation, generateAuthToken};