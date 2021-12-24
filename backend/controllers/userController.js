
//FIRST:- modal import
const User = require("../modals/userModel")
//ErrorHandler import
const ErrorHandler = require("../utils/ErrorHandler");
//catchAsyncErrors handle import
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
//jwt import
const sendToken = require("../utils/jwtToken");
//sendEmail import
const sendEmail = require("../utils/sendEmail");
//import crypto for resetPassword. its built-in module
const crypto = require("crypto");

//Register a user
exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
    const {name,email,password}=req.body;
    
    const user = await User.create({
        name,email,password, 
        avatar:{
            public_id:"This is a simple id",
            url:"profileUrl"
        }
    });
    //For jwt for response
      // const token = user.getJWTToken();

    // res.status(201).json({
    //     success:true,
    //     //user
    //     token, //jwt
    // });
    //jwtToken uses here.
    sendToken(user,201,res);
});

//Login User
exports.loginUser = catchAsyncErrors(async(req,res,next)=>{
     
    const {email,password}=req.body;
    //1st STEP:
    //checking if user has given password & email both
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    };
    //jodi user mile jay
    const user = await User.findOne({email}).select("+password");
                                    //select:false in Schema
                                    //tai .select("+password")deya lagbe.
    //jodi user na mile jay
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 401))
    } 
     
    //2ND STEP:
    const isPasswordMatched= await user.comparePassword(password);
     //compare password userModel e banate hobe.

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 401))
    }

    //jodi sob mile jay, tahole response
    // const token = user.getJWTToken();

    // res.status(200).json({
    //     success:true,
    //     //user
    //     token, //jwt
    // });
    //json webtoken for response
    sendToken(user,200,res);

});

//Logout User
exports.logout = catchAsyncErrors(async(req,res,next)=>{
    
    res.cookie("token", null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    })
    res.status(200).json({
        success:true,
        message:"Logged Out"
    })
})


// Forgot Password
 exports.forgotPassword = catchAsyncErrors(async (req, res, next)=>{
     //Find user through email
     const user = await User.findOne({email:req.body.email});

     if(!user){
         return next(new ErrorHandler ("User not found",404))
     };
     //get reset password token
     const resetToken = user.getResetPasswordToken();
     await user.save({validateBeforeSave:false});
     const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
     const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this mail then, please ignore id`;

 
     try{
         await sendEmail({
             email:user.email,
             subject:`Ecommerce Password Recovery`,
             message
         });//egula mailOptions e jabe.
         res.status(200).json({
             success:true,
             message:`Email sent to ${user.email} successfully`,
         })

     }catch(error){
         user.resetPasswordToken=undefined;
         user.resetPasswordExpire=undefined;

         await user.save({validateBeforeSave: false});
         return next(new ErrorHandler(error.message, 500));
     }
 }); 
 //Then add forgotPassword to rutes

//reset / recovery password
exports.resetPassword=catchAsyncErrors(async(req,res,next)=>{

    //creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");


    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now()}
    });

    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or, has been expired",400))
    };
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match",400))
    };

    user.password = req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();
    sendToken(user, 200, res);
})
//then add it route





// **USER ROUTE API STARTS FROM HERE=============================================================
//1. get user details, by which user can see his personal profile
exports.getUserDetails =catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user,
    })
});

//Update/Change password: user can change his profile password\
exports.updatePassword =catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Old Password is incorrect", 401))
    };
    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not Match",400))
    };
    user.password = req.body.newPassword;
    await user.save();

    sendToken(user, 200, res);
});

//Update user profile(name & email) or, (admin profile also)
exports.updateProfile =catchAsyncErrors(async(req,res,next)=>{
    
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
    }
    //we will add cloudinary later
    const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    })
});



//For ADMIN ACTIVITIES-------------
//1.Get All users: Admin jodi dekhte chay amar kotogulo user website e ase, sejonno.
exports.getAllUser = catchAsyncErrors(async(req, res, next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    })
})

//2.Get Single User: Admin jekono ekta user ke check korte parbe.
exports.getSingleUser = catchAsyncErrors(async(req, res, next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(
            new ErrorHandler(`User does not exist with id: ${req.params.id}`)
        )
    }
    res.status(200).json({
        success:true,
        user,
    })
})

//3.Admin update userRole or, user er profile
//That means, admin jodi kawke "admin" banate chay,tar jonno
exports.updateUserRole =catchAsyncErrors(async(req,res,next)=>{
    
    const newUserData = {
        name:req.body.name,
        email:req.body.email,
        role:req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true
    })
});

//4.Admin delete user or, (admin profile also)
exports.deleteUser =catchAsyncErrors(async(req,res,next)=>{
    
    const user = await User.findById(req.params.id);
    //we will remove cloudinary later

    if(!user){
        return next(
            new ErrorHandler(`User does not exist with Id:${req.params.id}`)
        )
    }
    await user.remove();

    res.status(200).json({
        success:true,
        message:"User deleted successfully"
    })
});














