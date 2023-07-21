const dotenv=require('dotenv');
const express = require('express');
const app= express();

dotenv.config({path:"./config.env"})
const port=process.env.PORT || 8000;

//for mongodb connection
require("./connection");

app.listen(port, ()=>{
    console.log(`listening on ${port}`);
})