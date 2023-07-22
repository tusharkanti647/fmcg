const { productModel } = require("../model/productSchema");
const { userModel } = require("../model/userSchema");


//curt get controller
//----------------------------------------------------------------------------------------------- 
const getCurtDetails = (req, res) => {
    try {
        if (req.user) {
            res.status(200).json(req.user.cart);
        } else {
            res.status(404).send("please login first");
        }
    } catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
};


//product add to customer curt
//------------------------------------------------------------------------------------------------
const curtAddProduct = async (req, res) => {
    try {
        if (req.user) {
            //get the product id
            const _id = req.params.id;
            //get the user id
            const userId = req.user.id;

            //get the product from products collection
            const data = await productModel.findOne({ _id: _id });

            //create a object of the product and quantity
            const pushingData = { ...data._doc, qty: req.body.qty };

            //push the object to the customers curt array
            const userData = await userModel.findOneAndUpdate({ _id: userId }, {
                $push: {
                    cart: pushingData,
                }
            }, {
                //for new updates document send to the response object
                new: true
            });
            res.status(200).json(userData.cart);
        } else {
            res.status(404).send("please login first");
        }
    } catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
};


//remove 1 product from basket
//----------------------------------------------------------------------------------
const removeOneCurtProduct = async (req, res) => {
    try {
        if (req.user) {
            const _id = req.user.id;

            //get the product titel from req body
            const pTitel = req.body.titel;

            //find the user then delete the product titel match in curt
            const response = await userModel.findOneAndUpdate({ _id: _id }, {
                $pull: { cart: { titel: pTitel } }
            }, {
                new: true
            });

            res.status(200).json(response.cart)
        }else{
            res.status(404).send("please login first");
        }
    } catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
};

// to do empty the cart
//-----------------------------------------------------------------------------------------------
const emptyCurt = async (req, res) => {
    try {
        if (req.user) {
            const _id = req.user.id;

            //empty the user curt
            const response = await userModel.updateOne({ _id: _id }, {
                $set: { cart: [] }
            });
            res.status(200).json(response)
        }else {
            res.status(404).send("please login first");
        }
    } catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
};


// update the quantity in curt product
//-----------------------------------------------------------------------------------------------
const editCurtQuantity = async (req, res) => {
    try {
        if (req.user) {
            //get user id
            const _id = req.user.id;
            //get the product titel that update
            const pTitel = req.body.titel;

            //find the product in user curt, and update it quantity
            const response = await userModel.updateOne({ _id: _id, "cart.titel": pTitel }, {
                $set: { "cart.$.qty": req.body.qty }
            });
            res.status(200).json(response);
        }else {
            res.status(404).send("please login first");
        }
    } catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
};



module.exports = { curtAddProduct, removeOneCurtProduct, emptyCurt, getCurtDetails, editCurtQuantity }