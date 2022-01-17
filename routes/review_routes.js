const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync");   //For error handling of Async
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware"); //ValidateReview using JOI on client side
const reviewController=require("../controllers/review");


//For posting reviews
router.post('/reviews',isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete route for a review
router.delete("/reviews/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports=router;