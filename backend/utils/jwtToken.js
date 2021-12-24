
//1st bcrypt korbo userModel e, then jwt er kaj korbo.
//Create token and saving cookie
const sendToken = (user,statusCode,res) =>{
    const token = user.getJWTToken(); //eti ekta method
    //options for cookie
    const options = {
        expires:new Date(
            Date.now() + process.env.COOKIE_EXPIRE*24*60*60*1000
        ),
        httpOnly:true,
    };
    //diff. diff. statusCode ase, tai - status(statusCode)
    res.status(statusCode).cookie("token", token, options).json({
        success:true,
        user,
        token,
    });
};
//etake userController e import kore
module.exports = sendToken;




