
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const { adminModel } = require("../model/adminSchema");
const { userModel } = require("../model/userSchema");
const { generateAuthToken, numberValidation, mailValidation, passwordValidation } = require("../myModule/operation");

const secretKey = process.env.KEY;




//Registering admin controller
//------------------------------------------------------------------------------------------
const registerAdmin = async (req, res) => {
    const { name,
        number,
        email,
        password,
        conPassword } = req.body;


    //check all filled is filledup or not
    if (!name || !number || !email || !password || !conPassword) {
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


//get customers from db
//----------------------------------------------------------------
const getCustomer = async (req, res) => {
    try {
        if (req.user.isAdmin) {
            let { searchName, page, sortQue } = req.query;

            //default values for searchName, page, sortQue
            searchName = searchName || "";
            page = page - 1 || 0;
            sortQue = sortQue ? sortQue.split(" ") : ["lastActivity", "-1"];
            let limit = 3;

            //create sortby object key and sort quary
            let sortBy = {};
            sortBy[sortQue[0]] = parseInt(sortQue[1]);

            const data = await userModel.find({ name: { $regex: searchName, $options: "i" } })
                .sort(sortBy)
                .skip(page * limit)
                .limit(limit);
            //const data = await customerModel.find({ name: { $regex: searchName, $options: "i" } }).sort ( { date: -1} );

            //data2 check the next page present or not
            const data2 = await userModel.find({ name: { $regex: searchName, $options: "i" } })
                .sort(sortBy)
                .skip((page + 1) * limit)
                .limit(limit);
            let isNextPagePresent = false;
            if (data2.length > 0) {
                isNextPagePresent = true;
            }

            res.status(200).json({ data: data, isNextPagePresent: isNextPagePresent });
        } else {
            res.status(404).json({ message: "please login first" });
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
};

//delete customer 
//----------------------------------------------------------------
const deleteCustomer = async (req, res) => {
    try {
        if (req.user.isAdmin) {
            let _id = req.params.id;
            //if id not present in params return
            if (!_id) {
                res.status(404).send("please select a customer id");
                return;
            }

            const data = await userModel.deleteOne({ _id });
            //console.log(data);
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "please login first" });
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
};

//get 1 customers details
//----------------------------------------------------------------
const getOneCustomerDetails = async (req, res) => {
    try {
        if (req.user.isAdmin) {
            //if id not present in params return
            if (!req.params.id) {
                res.status(404).send("please select a customer id");
                return;
            }

            const customer = await userModel.findById(req.params.id);
            if (customer) {
                res.status(200).json(customer);
            } else {
                res.status(404).json({ message: "customer not found" });
            }
        } else {
            res.status(404).json({ message: "please login first" });
        }

    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
};



module.exports = {
    registerAdmin, signinAdmin, getCustomer, deleteCustomer, getOneCustomerDetails
};
