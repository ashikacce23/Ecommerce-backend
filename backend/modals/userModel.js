
const mongoose = require("mongoose");
const validator = require("validator");
//for password hash
const bcrypt = require("bcryptjs");
//JWT import
const jwt = require("jsonwebtoken");
//crypto built-in module, install kora lagbena
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please Enter your Name"],
        maxlength:[30, "Name cannot axceed 30 character"],
        minlength:[4, "Name should have more than 4 character."]
    },
    email:{
        type:String,
        required:[true, "Please Enter your email"],
        unique:true,
        validate:[validator.isEmail, "Please enter a valid email"],
    },
    password:{
        type:String,
        required:[true, "Please Enter your password"],
        minlength:[8,"Password should be greater than 8 character"],
        select:false
    },
    avatar:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});

//1-bcrypt For password
//ekhane arrow func neya hoyni, karon this arrow function e use kora jayna
userSchema.pre("save", async function(next){

    //2nd-for duplicate error
    if(!this.isModified("password")){
        next();
    }
    //main code 
    this.password = await bcrypt.hash(this.password,10)
});

//2-JWT Tocken create
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    })
}
 

//3-last: compare password with jwt
userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

//4-For Forgot password
userSchema.methods.getResetPasswordToken = function(){
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    //Hashing & adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.resetPasswordExpire = Date.now()+15*60*1000 //15mins
    return resetToken;
}
//end forgot password
module.exports=mongoose.model("User",userSchema);


