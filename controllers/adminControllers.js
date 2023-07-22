
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { adminModel } = require("../model/adminSchema");

const secretKey = process.env.KEY;




//Registering admin controller
//------------------------------------------------------------------------------------------
const registerAdmin = async (req, res) => {
    const { name,
        number,
        email,
        password,
        conPassword} = req.body;

    try {
        const admin = new adminModel({
            name,
            number,
            email,
            password: bcrypt.hashSync(password, 10),
            conPassword: bcrypt.hashSync(conPassword, 10),
        });

        const response = await admin.save();

        //generate token call the function
        const token = await generateAuthToken(response._id);
        res.status(201).json({ admin, token: "Bearer " + token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to create admin' });
    }

};


//sign admin controller
//------------------------------------------------------------------------------------------
const signinAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        //check all filled is filledup or not
        if (!email || !password) {
            res.status(400).json("invalid Credentials");
            return;
        }

        //find the admin from mongodb
        let admin = await adminModel.findOne({ email: email });
        if (!admin) {
            res.status(400).json({ message: "admin not present" });
            return;
        }

        //compare the hash password and match it
        if (!bcrypt.compareSync(req.body.password, admin.password)) {
            res.status(400).json({ message: "password not match" });
            return;
        }

        //generate token call the function
        const token = await generateAuthToken(admin._id);
        res.status(201).json({ admin, token: "Bearer " + token });
    } catch (error) {
        console.log(err);
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
    registerAdmin, signinAdmin
};
