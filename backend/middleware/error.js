 const ErrorHandler = require('../utils/ErrorHandler');

 module.exports = (err, req, res, next) =>{
     //jodi error hoy
     err.statusCode = err.statusCode || 500;
     err.message = err.message || "Internal Server Error";

     //wrong mongodb ID error- 2nd time koresi
      if(err.name === "CastError"){
          const message = `Resource not found: ${err.path}`;
          err = new ErrorHandler(message,400)
      }


      //@@@@@@@@@@- 2Nd Time Error After Authentication@@@@@@@@@
      //1.Duplicate Email error / MDB id error
      if(err.code === 11000){
          const message=`Duplicate ${Object.keys(err.keyValue)} Entereed`;
          err=new ErrorHandler(message, 400);
      }
      //2.jwt error: kew jodi vul token enter kore tahole
      if(err.code === "JsonWebTokenError"){
        const message=`Json web Token not valid, try again`;
        err=new ErrorHandler(message, 400);
    }
    //3. jwt expire error
    if(err.code === "TokenExpiredError"){
        const message=`Json web Token is expired, try again`;
        err=new ErrorHandler(message, 400);
    }

    //jodi error na hoy.
     res.status(err.statusCode).json({
         success:false,
         message:err.message
         //error:err
        //  error:err.stack
        //err.stake dile full details chole asbe.
     });
 };
 //eke app.js e import korbo & middleware hisebe use korbo.

