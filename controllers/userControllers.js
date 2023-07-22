
const bcrypt = require("bcryptjs");
const passport = require("passport");


const { userModel } = require("../model/userSchema");
const { passwordValidation, mailValidation, numberValidation, generateAuthToken } = require("../myModule/operation");


//Registering user controller
//------------------------------------------------------------------------------------------
const registerUser = async (req, res) => {
    try {
        const { name,
            number,
            email,
            password,
            conPassword,
            address } = req.body;

        //check all filled is filledup or not
        if (!name || !number || !email || !password || !conPassword || !address) {
            res.status(400).json({ message: "please provide data" });
            return;
        }

        // Check the password, mail and number validation
        if (!passwordValidation(password)) {
            res.status(400).json({ message: "password is invalid" });
            return;
        }
        
        //check if password and confirm password are same
        if (password !== conPassword) {
            res.status(400).json({ message: "password are not match" });
            return;
        }
        
        if (!mailValidation(email)) {
            res.status(400).json({ message: "email is invalid" });
            return;
        }
        if (!numberValidation(number)) {
            res.status(400).json({ message: "phone number is invalid" });
            return;
        }


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
        console.log(err);
        res.status(404).json({ message: err.message });
    }
};


module.exports = {
    registerUser, signinUser
};