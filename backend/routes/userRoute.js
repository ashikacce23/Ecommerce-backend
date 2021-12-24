
const express = require("express");
const { 
    registerUser, loginUser, 
    logout, forgotPassword, 
    resetPassword, getUserDetails, 
    updatePassword, updateProfile, 
    getAllUser, getSingleUser, 
    updateUserRole,
    deleteUser
 } = require("../controllers/userController");
const router = express.Router();

//USER ROUTE API PART
const {isAuthentication, authorizeRoles} = require ("../middleware/auth")

//1-for userRegister
router.route("/register").post(registerUser);
//2-for userLogin
router.route("/login").post(loginUser);
//4-forgot password
router.route("/password/forgot").post(forgotPassword);
//5-reset password
router.route("/password/reset/:token").put(resetPassword);
//3-for logout
router.route("/logout").get(logout);

//For USER ROUTE API PART====================
//1. getUserDetails
router.route("/me").get(isAuthentication, getUserDetails);
//2. For update/change password
router.route("/password/update").put(isAuthentication, updatePassword);
//3. updateProfile for user & admin
router.route("/me/update").put(isAuthentication, updateProfile);

//FOR ADMIN ROUTE================
//get all user
router.route("/admin/users").get(isAuthentication, authorizeRoles("admin"),getAllUser);
//get single user
router.route("/admin/user/:id").get(isAuthentication, authorizeRoles("admin"),getSingleUser);
//Admin update User profile
router.route("/admin/user/:id").put(isAuthentication, authorizeRoles("admin"),updateUserRole);
//Admin can delete user
router.route("/admin/user/:id").delete(isAuthentication, authorizeRoles("admin"),deleteUser);

module.exports= router; 
//etake App.js e use korbo.




