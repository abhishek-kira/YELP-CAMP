const express = require('express');
const router = express.Router();
const passport = require('passport');
const wrapAsync = require('../utils/wrapAsync');
const userController=require("../controllers/user");

//Register Form for new User
router.get('/register',userController.renderRegister);

//Register a User
router.post('/register', wrapAsync(userController.register))

//Login Form for new User
router.get("/login",userController.renderLogin);

//Login a User
router.post("/login",passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),userController.login)

//Logout a User
router.get("/logout",userController.logout);

module.exports=router;