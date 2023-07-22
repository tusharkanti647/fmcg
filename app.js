const dotenv = require('dotenv');
const express = require('express');
const app = express();

dotenv.config({ path: "./config.env" })
const port = process.env.PORT || 8000;

//for mongodb connection
require("./connection");


//connect the user Routes
app.use('/user', require('./routers/userRoutes'));
app.use("/admin", require("./routers/adminRoutes"));
app.use("/products", require("./routers/productRoutes"));
app.use("/curt", require("./routers/cartRoutes"));

app.listen(port, () => {
    console.log(`listening on ${port}`);
})

