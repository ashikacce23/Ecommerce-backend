const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter product name"]
    },
    description:{
        type:String,
        required:[true, "Please enter product description"]
    },
    price:{
        type: Number,
        required:[true, "Please enter product price"],
        maxlength: [8, "Price can not exceed 8 character"]
    },
    ratings:{ //sob user er rating gula gor hobe ekhane.
        type: Number,
        default:0
    },
    images:[
        {
            public_id:{
                type: String,
                required: true
            },
            url:{
                type: String,
                required: true
            }
        }
    ],
    category:{
        type: String,
        required:[true, "Please enter product category"]
    },
    stock:{
        type: Number,
        required:[true, "Please enter product stock"],
        maxlength:[4, "Stock can not axceed 4 characters"],
        default:1
    },
    numOfReviews:{
        type: Number,
        default:0
    },
    reviews:[ //je review debe tar requirements.
        {
            user:{ //Ei user pore add korsi.
                type:mongoose.Schema.ObjectId,
                ref:"User",//Schema er User
                required:true
        
            },
            name:{
                type: String,
                required:true
            },
            rating:{ //single user er rating
                type: Number,
                required: true
            },
            comment:{
                type: String,
                required: true
            }
        }
    ],
    //Creating after logout & admin check part-9
    //product ke banaise, seta janar jonno-
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",//Schema er User
        required:true

    },
    createdAt:{//kobe review dilo,sei date
        type: Date,
        default: Date.now
    }
})

module.exports=mongoose.model("product",productSchema)
//ekhane "product"- holo collection name.


