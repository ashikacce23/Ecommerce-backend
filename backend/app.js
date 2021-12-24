const express = require("express");
const app = express();
//auth time
const cookieParser = require("cookie-parser")

//use json from app/ express 
app.use(express.json())
//cookie-parser use - when creating auth.js
app.use(cookieParser());

//ALL ROUTES IMPORT HERE==========================
//productRoute import
const product = require("../backend/routes/ProductRoute");
//userRoute import
const user = require("../backend/routes/userRoute");
//orderRoute import
const order = require("../backend/routes/OrderRoute")

//USER THESE ROUTE ================
//use productRoute
app.use("/api/v1",product)
//use userRoute
app.use("/api/v1",user)
//use orderRoute
app.use("/api/v1",order)

//Middleware for error
const ErrorMiddleware = require("./middleware/error");
app.use(ErrorMiddleware);

module.exports=app;