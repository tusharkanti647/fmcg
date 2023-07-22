
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const secretKey = process.env.KEY;

const { userModel } = require("../model/userSchema");


//Registering user controller
//------------------------------------------------------------------------------------------
const registerUser = async (req, res) => {
    const { name,
        number,
        email,
        password,
        conPassword,
        address } = req.body;

    try {
        const user = new userModel({
            name,
            number,
            email,
            password: bcrypt.hashSync(password, 10),
            conPassword: bcrypt.hashSync(conPassword, 10),
            address
        });

        const response = await user.save();

        //generate token call the function
        const token = await generateAuthToken(response._id);
        res.status(201).json({ user, token: "Bearer " + token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to create user' });
    }

};


//sign user controller
//------------------------------------------------------------------------------------------
const signinUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check all filled is filledup or not
        if (!email || !password) {
            res.status(400).json("invalid Credentials");
            return;
        }

        //find the user from mongodb
        let user = await userModel.findOne({ email: email });
        if (!user) {
            res.status(400).json({ message: "user not present" });
            return;
        }

        //compare the hash password and match it
        if (!bcrypt.compareSync(req.body.password, user.password)) {
            res.status(400).json({ message: "password not match" });
            return;
        }

        //generate token call the function
        const token = await generateAuthToken(user._id);
        res.status(201).json({ user, token: "Bearer " + token });
    } catch (error) {
        console.error(err);
        res.status(404).json({ message: err.message });
    }
};



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


module.exports = {
    registerUser, signinUser
};