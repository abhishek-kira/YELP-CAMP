const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");   //For error handling of Async
const {isLoggedIn,isAuthor,validateCamp}=require("../middleware");
//IslogggedIn,IsAuthor (Check if current loggedin user is author of that camp),Validatecamp(for JOI validations on client side)
const campgroundController=require("../controllers/campgrounds");
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

//Index page
router.get("/",wrapAsync(campgroundController.index))

//Form for new Camp
router.get("/new",isLoggedIn,campgroundController.renderNewForm)

//Post for saving new camp
router.post("/",isLoggedIn,upload.array('image'),validateCamp,wrapAsync(campgroundController.createCampground))

//For individual camp all its data and reviews made on it
router.get('/:id',wrapAsync(campgroundController.showCampground))

//Form for edit
router.get('/:id/edit',isLoggedIn,isAuthor,wrapAsync(campgroundController.renderEditForm));

// Put For update 
router.put("/:id",isLoggedIn,isAuthor,upload.array("image"),validateCamp,wrapAsync(campgroundController.updateCampground));

//Delete For delete
router.delete("/:id",isLoggedIn,isAuthor,wrapAsync(campgroundController.deleteCampground));

module.exports=router;