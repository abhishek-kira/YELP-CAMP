const { campgroundSchema , reviewSchema }=require("./schemas");  //Joi schemas for validation
const Campground=require("./models/campground");
const AppError=require("./utils/AppError");
const Review=require("./models/review");



//For checking If user is login to access certain routes
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

//Validate Camp using JOI
module.exports.validateCamp=(req,res,next)=>
{
    const { error }=campgroundSchema.validate(req.body);
    if(error)
    {
        const msg=error.details.map(el=>(el.message)).join(",");
        throw new AppError(msg,400);
    }
    else
    {
        next();
    }
}

//Checks if camp owned by current loggedIn user
module.exports.isAuthor=(async(req,res,next)=>
{
    const {id}=req.params;
    const camp=await Campground.findById(id);
    if(!camp.author.equals(req.user._id))
    {
        req.flash("error","You dont have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
})

//Checks if review owned by current loggedIn user
module.exports.isReviewAuthor=(async(req,res,next)=>
{
    const {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
    if(!review.author.equals(req.user._id))
    {
        req.flash("error","You dont have permission to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
})

//Valdation of review Using JOI
module.exports.validateReview=(req,res,next)=>
{
    // console.log(req.body); 
    const { error }=reviewSchema.validate(req.body);
    // console.log(req.body);
    if(error)
    {
        const msg=error.details.map(el=>(el.message)).join(",");
        throw new AppError(msg,400);
    }
    else
    {
        next();
    }
}


