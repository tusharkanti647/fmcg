const { productModel } = require("../model/productSchema");


//add product controller
//----------------------------------------------------------------
const addProduct = async (req, res) => {
    try {
        //only admins can add products
        if (req.user.isAdmin) {
            const {
                category,
                imgLink,
                titel,
                discountPrice,
                originalPrice,
                rating,
                weight,
                pcs,
                description } = req.body;

            //check all filled is filledup or not
            if (!category || !imgLink || !titel || !discountPrice || !originalPrice || !rating || !weight || !pcs || !description) {
                res.status(400).json({ message: "please provide data" });
                return;
            }


            //save data in mongodb
            const product = new productModel({
                category,
                imgLink,
                titel,
                discountPrice,
                originalPrice,
                rating,
                about: {
                    weight,
                    pcs,
                    description
                }
            });

            const response = await product.save();
            res.status(200).json(response);
        } else {
            res.status(404).json({ message: "please login first" });
        }

    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
};


//product search get path
//-----------------------------------------------------------------------------
const getProductList = async (req, res) => {
    try {
        let { searchName, page, sortQue, filters } = req.query;

        //default values for search, page, sortQue, filters
        searchName = searchName || ""; //search the name
        page = page - 1 || 0;
        sortQue = sortQue ? sortQue.split(" ") : ["rating", "-1"]; //sort the product accroding the rating, price low to high, sort to high. ["rating", "-1"] first array element is sort key, and send element sort low to high or high to low .
        filters = filters ? filters.split(" ") : ["electronic", "book", "mobile", "laptop"]; //["electronic", "books", "mobile", "laptop"] filter my document accroding my arraylist present catagory present waise.
        let limit = 8; //pare page limit
 
        //create sortby object key and sort quary
        let sortBy = {};
        sortBy[sortQue[0]] = parseInt(sortQue[1]);


        const data = await productModel.find({ titel: { $regex: searchName, $options: "i" } })
            .where("category")
            .in(filters)
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit);

        //data2 check the next page present or not
        const data2 = await productModel.find({ titel: { $regex: searchName, $options: "i" } })
            .where("category")
            .in(filters)
            .sort(sortBy)
            .skip((page + 1) * limit)
            .limit(limit);

        let isNextPagePresent = false;
        if (data2.length > 0) {
            isNextPagePresent = true;
        }

        res.status(200).json({ data: data, isNextPagePresent: isNextPagePresent });
    } catch (e) {
        console.log(e);
        res.status(404).json(e);
    }
};

//one product  details get
//----------------------------------------------------------------------------
const getOneProductDetails = async (req, res) => {
    try {
        //if id not present in params return
        if (!req.params.id) {
            res.status(404).send("please select a product id");
            return;
        }
        const data = await productModel.findById(req.params.id);
        res.status(200).json(data);
    } catch (err) {
        res.status(404).send(err);
    }
};

//delete product controller
//----------------------------------------------------------------
const productDelete = async (req, res) => {
    try {
        //only admins can delete products
        if (req.user.isAdmin) {
            let _id = req.params.id;

            //if id not present in params return
            if (!_id) {
                res.status(404).send("please select a product id");
                return;
            }
            const data = await productModel.deleteOne({ _id });
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "please login first" });
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
};


//edit product details. only admin can do this.
//----------------------------------------------------------------
const editProduct = async (req, res) => {
    try {
        if (req.user.isAdmin) {
            let _id = req.params.id;

            //if id not present in params return
            if (!_id) {
                res.status(404).send("please select a product id");
                return;
            }

            const {
                category,
                imgLink,
                titel,
                discountPrice,
                originalPrice,
                rating,
                weight,
                pcs,
                description } = req.body;

            //check all filled is filledup or not
            if (!category || !imgLink || !titel || !discountPrice || !originalPrice || !rating || !weight || !pcs || !description) {
                res.status(400).json({ message: "please provide data" });
                return;
            }

            const data = await productModel.updateOne({ _id: _id }, {
                $set: {
                    category,
                    imgLink,
                    titel,
                    discountPrice,
                    originalPrice,
                    rating,
                    about: {
                        weight,
                        pcs,
                        description
                    }
                }
            });
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: "please login first" });
        }

    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err.message });
    }
};

module.exports = { addProduct, getProductList, getOneProductDetails, productDelete, editProduct };