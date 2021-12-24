const express = require("express");
const router = express.Router();
//authentication import korte hobe for login/logout
const { isAuthentication,authorizeRoles } = require("../middleware/auth");
//all routes import here
const { newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/OrderController");

//======== For user  ============
//CREATE ORDER
router.route("/order/new").post(isAuthentication, newOrder);
//usAuthentication- user login thaklei order korte parbe
//get single product using product "order id"
router.route("/order/:id").get(isAuthentication, getSingleOrder);
//Get ordered product by user.
router.route("/orders/me").get(isAuthentication, myOrders);

//==============For ADMIN==============
//get all orders
router.route("/admin/orders").get(isAuthentication, authorizeRoles("admin") ,getAllOrders);
//update order
router.route("/admin/order/:id").put(isAuthentication, authorizeRoles("admin"), updateOrder);
//delete order
router.route("/admin/order/:id").delete(isAuthentication, authorizeRoles("admin"), deleteOrder);
module.exports = router;







