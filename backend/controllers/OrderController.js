const Order = require("../modals/orderModals");
//Error handler & product model import
const Product = require("../modals/productModals");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


//Create new order
exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),//kobe order korse setar jonno
        user:req.user._id //user login thakle order korte parbe,tai _id
    });
    res.status(200).json({
        success:true,
        order,
    })
});

//get single order or, order details
exports.getSingleOrder = catchAsyncErrors( async (req, res, next)=>{
   //const order = await Order.findById(req.params.id)
    const order = await Order.findById(req.params.id).populate(
        "user",         //user er name & email er jonno "populate"
        "name email"           //code tuku korte hobe.
    );
    if(!order){
        return next ( ErrorHandler ("Order not found with this id",404))
    }
    res.status(200).json({
        success:true,
        order
    })
})

//get LOGGED IN user orders
//user order korar por tar order status dekhbe.
exports.myOrders = catchAsyncErrors( async (req, res, next)=>{
  
    const orders = await Order.find({user:req.user._id}); //eti filter {}
    //jehetu user loggin obosthay thakbe, tai _id
  
    res.status(200).json({
        success:true,
        orders,
    })
});


//FOR ADMIN==============

// get all orders--admin 
exports.getAllOrders = catchAsyncErrors( async (req, res, next)=>{
  
    const orders = await Order.find(); //sob order pabo.

    //for showing totalAmount of product price
    let totalAmount = 0; //here use let, not const

    orders.forEach((order)=>{
        //  totalAmount = order+order.totalPrice;
        totalAmount += order.totalPrice;
    })
  
    res.status(200).json({
        success:true,
        orders,
        totalAmount,
    })
});

// update orders--admin 
exports.updateOrder = catchAsyncErrors( async (req, res, next)=>{
  
    const order = await Order.findById(req.params.id); 
    
    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
//jodi delivered age thek hoye hoye thake
    if(order.orderStatus==="Delivered"){
        return next ( new ErrorHandler("You have already delivered this order",400))
    }
     //Delivered hole or, 1ti product chole gele 1ti komate hobe. === 
     order.orderItems.forEach(async (orderQuantity) =>{
        await updateStock (orderQuantity.product, orderQuantity.quantity)
    }) //updateStock er function create korte hobe
    

    //je tarikhe delivered hoise tar date
    order.orderStatus = req.body.status;
    if(req.body.status==="Delivered"){
        order.deliveredAt = Date.now();
    }
    await order.save({validateBeforeSave:false});
    res.status(200).json({
        success:true,
    })
});
//updateStock function
async function updateStock (id, quantity){
    const product = await Product.findById(id);

    // product.stock = product.stock - quantity}
    product.stock -= quantity;
    await product.save({validateBeforeSave:false})
}



// delete order--admin 
exports.deleteOrder = catchAsyncErrors( async (req, res, next)=>{
  
    const order = await Order.findById(req.params.id); 

    if(!order){
        return next (new ErrorHandler("Order not found",404))
    }
    //order khuje powa gele delete/remove koro
    await order.remove();
    
    res.status(200).json({
        success:true,
    })
});




























