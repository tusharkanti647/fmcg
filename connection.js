const mongoose = require('mongoose');

const db=process.env.DATABASE;

mongoose.connect(db).then(()=>{
    console.log("Connect with MongoDB")
})
.catch((err)=>{
    console.log(err);
})