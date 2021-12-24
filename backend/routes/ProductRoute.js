const express = require("express");
const router = express.Router();
//authentication import for login/logout
const { isAuthentication,authorizeRoles } = require("../middleware/auth");
//all imported route here
const { getAllProducts, 
createProduct, 
updateProduct, 
deleteProduct, 
getProductDetails, 
createProductReview,
getProductReviews,
deleteReview} = require("../controllers/ProductController");



// //At first created for demo.
// router.route("/products").get(getAllProducts);
//create product--ADMIN
router.route("/admin/product/new").post(isAuthentication,authorizeRoles("admin"),createProduct);
//get All product
router.route("/products").get(getAllProducts);
//for authorizeRoles testing
// router.route("/products").get(isAuthentication,authorizeRoles("admin"),getAllProducts);
//update product--ADMIN
router.route("/admin/product/:id").put(isAuthentication,authorizeRoles("admin"),updateProduct);
//delete product -- ADMIN
router.route("/admin/product/:id").delete(isAuthentication,authorizeRoles("admin"),deleteProduct);
//Extra @==> Get product details / single product
router.route("/product/:id").get(getProductDetails);

//REVIEWS
router.route("/review").put(isAuthentication,createProductReview);
router.route("/reviews").get(getProductReviews); //login proyojon nai, tai no isAuthication.
router.route("/reviews").delete(isAuthentication, deleteReview);//login proyojon
//N.B: isAuthentication amra sekhane use korbo, jekhane update, delete
//create korte login/register er proyojon hoy.
module.exports = router;





