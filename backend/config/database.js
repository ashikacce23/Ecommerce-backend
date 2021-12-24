const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// mongoose.connect(process.env.DB_URL)
// .then(()=>{
//     console.log("Mongodb connect with server");
// }).catch((err)=>{
//     console.log(err);
// })
//Ekti function er vitore nisi.<=@@=>
const connectDatabase =()=>{
mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log("Mongodb connect with server");
 })//.catch((err)=>{
//     console.log(err);
// })
}
//jehetu amra server.js e DB error handling korsi,
//tai database e ".catch"- rakhae dorkar nai.
module.exports=connectDatabase;






