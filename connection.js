const mongoose = require('mongoose');

db="mongodb://127.0.0.1:27017/fmcg"
//const db=process.env.DATABASE;

mongoose.connect(db).then(()=>{
    console.log("Connect with MongoDB")
})
.catch((err)=>{
    console.log(err);
})