




//add product api

const { productModel } = require("../model/productSchema");

//----------------------------------------------------------------
const addProduct = async (req, res) => {
    try {
        console.log(req.user);
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
        searchName = searchName || "";
        page = page - 1 || 0;
        sortQue = sortQue ? sortQue.split(" ") : ["rating", "-1"];
        filters = filters ? filters.split(" ") : ["electronic"];
        let limit = 8;

        let sortBy = {};
        sortBy[sortQue[0]] = parseInt(sortQue[1]);


        const data = await productModel.find({ titel: { $regex: searchName, $options: "i" } })
            .where("category")
            .in(filters)
            .sort(sortBy)
            .skip(page * limit)
            .limit(limit);

        const data2 = await productModel.find({ titel: { $regex: searchName, $options: "i" } })
            .where("category")
            .in(filters)
            .sort(sortBy)
            .skip((page + 1) * limit)
            .limit(limit);
        let isNextPagePresent = false;
        if (data2.length>0) {
            isNextPagePresent = true;
        }
        
        res.status(200).json({ data: data, isNextPagePresent: isNextPagePresent });
    } catch (e) {
        console.log(e);
        res.status(404).json(e);
    }
};

module.exports = {addProduct, getProductList};