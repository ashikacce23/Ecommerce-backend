
//catchAsyncErrors import
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
//userModel-eta userSchema
const User = require("../modals/userModel")

//1-isAuthentication - login ase naki logout, eta check kore
exports.isAuthentication = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;

    // console.log(token);
    if(!token){
        return next(new ErrorHandler("Please Login to access this response",401))
    }
    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById (decodeData.id); //ekhane just .id hobe.
    next();
})
//erpor logout banate hobe. Then "authorizeRoles"
//=>productRoute.


//2-autorizeRoles creation- for admin
// "admin" naki onno kew? seta check kore
exports.authorizeRoles = (...roles) =>{
    return (req,res,next) =>{
        
        if(!roles.includes(req.user.role)){
           return next(
                new ErrorHandler(
                `Role-authorize: ${req.user.role} is not allowed to access this resource`,403
            )
            );
        }
        next();
    };
}




