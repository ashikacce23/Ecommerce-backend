
const Product = require("../modals/productModals");
//ErrorHandler import
const ErrorHandler = require("../utils/ErrorHandler");
//catchAsyncErrors handle import
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
//import ApiFeatures
const ApiFeatures = require("../utils/apiFeatures");

//CREATE PRODUCT -- Admin
exports.createProduct = catchAsyncErrors(async (req,res,next) =>{
    //ke product create korse/kon id theke korse, seta bojhar jonno
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
});

//get all product 
exports.getAllProducts = catchAsyncErrors(async (req,res)=>{

    const resultPerPage = 8; //per page 10 result
                       //imported
   const productsCount = await Product.countDocuments();

   const apiFeature = new ApiFeatures(Product.find(), req.query)
   .search()
   .filter()
   .pagination(resultPerPage)
   const products = await apiFeature.query;
    // const products = await Product.find();
    res.status(200).json({
        success: true,
        products, //VVI**success hole product gulo chole asbe
        productsCount,
    })
});
//update product - Admin
exports.updateProduct = catchAsyncErrors(async (req,res,next)=>{
    //1st id diye product khuje nite hobe.
    let product = await Product.findById(req.params.id);
    //jodi product khuje na pai
    if(!product){
        return next(new ErrorHandler("Product not found!",404))
    }
    // if(!product){
    //     return res.status(500).json({
    //         success: false,
    //         message:"Product not found"
    //     })
    // }
    //=>jodi product khuje pai,tahile
    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true,
        useFindAndModify:false
    });
    res.status(200).json({
        success:true,
        message:"Updated successfully"
    })
});

//delete product -- ADMIN
exports.deleteProduct = catchAsyncErrors(async (req,res,next)=>{
    //1st id diye product khuje nite hobe. 
    const product = await Product.findById(req.params.id);
    //jodi khuje na powa jay
    if(!product){
        return next(new ErrorHandler("Product not found!",404))
    }
    // if(!product){
    //     return res.status(500).json({
    //         success: false,
    //         message:"Product not found"
    //     })
    // }
    //=>ar khuje powa gele
    await product.remove();
    res.status(200).json({
        success: true,
        message:"Product deleted successfully"
    })
});

//Extra @@==> Get product details/ single product
exports.getProductDetails = catchAsyncErrors(async (req,res,next)=>{
    //1st id diye product khuje nite hobe. 
    const product = await Product.findById(req.params.id);
    //jodi khuje na powa jay
    if(!product){
        return next(new ErrorHandler("Product not found!",404))
        // return res.status(500).json({
        //     success: false,
        //     message:"Product not found"
        // })
    }
    //jodi powa jay
    res.status(200).json({
        success: true,
        product //VVI**success hole product detail chole asbe
    })
});//N.B: kono single product dekhte chaile id dhore dekhte hobe.

// //At first created for demo.
// exports.getAllProducts = (req,res)=>{
//     res.status(200).json({message:"Route is working."})
// }




// //PRODUCT-REVIEW======================
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id, // _id mane holo- je user login ase 
    name: req.user.name, // se reviews & rating debe
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  //jodi age review deya thake tahole-just update kore debe
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {//jodi age review na deya thake tahole new rev add hobe
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
//rating update
  let avg = 0;
  product.reviews.forEach((rev) => {   //rating = reviews er rating
    avg += rev.rating;                //ratings = total avarage ratings
  });
//total avarage rating
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// Sob review dekhar jonno========================
//Get all reviews
exports.getProductReviews = catchAsyncErrors(async(req,res,next)=>{
 
  const product = await Product.findById(req.query.id);
  
  if(!product){
    return next (new ErrorHandler("Product not found", 404))
  }
  res.status(200).json({
    success:true,
    reviews:product.reviews,
  })
})

// Delete Product Reviews & update
exports.deleteReview = catchAsyncErrors(async(req,res,next)=>{
   // const product = await Product.findById(req.query.id); or,
  const product = await Product.findById(req.query.productId)
                      //ekhane productId dite hobe
  if(!product){
    return next(new ErrorHandler("Product not found",404))
  }
  const reviews = product.reviews.filter(
    (rev)=>rev._id.toString() !== req.query.id.toString()
  )
  let avg = 0;
  reviews.forEach((rev) => {   
    avg += rev.rating;               
  });

  const ratings = avg / reviews.length;
  const numOfReviews = reviews.length;
   
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    ratings,
    numOfReviews,
  },{ //2nd parameter
    new:true,
    runValidators: true,
    useFindAndModify: false,
  })
  //_id holo user review deyar por review er je _id create hoy, sei id eta.
  //.id holo basic normal id.
  
  res.status(200).json({
    success:true
  })
})















