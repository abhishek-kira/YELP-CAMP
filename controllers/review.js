const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    // console.log(camp,req.body);
    const review = new Review(req.body.review);
    // console.log(review);
    review.author=req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash("success","Successfuly Posted the review!");
    res.redirect(`/campgrounds/${camp._id}`);
    // console.log(req.body.review.rating);
}

module.exports.deleteReview = async(req,res)=>
{
    // console.log("Delete");
    const {id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Successfuly Deleted the review!");
    res.redirect(`/campgrounds/${id}`);
}