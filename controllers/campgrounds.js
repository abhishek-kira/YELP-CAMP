const Campground = require('../models/campground');
const {cloudinary}=require("../cloudinary");
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken=process.env.MAPBOX_TOKEN
const geoCoder=mbxGeocoding({accessToken:mapBoxToken});
 

module.exports.index = async (req,res)=>
{
    const camps=await Campground.find({});
    res.render("campgrounds/index.ejs",{camps});
}

module.exports.renderNewForm = (req,res)=>
{
    res.render("campgrounds/new");
}

module.exports.createCampground = async (req,res)=>
{
    console.log(req.body);
    const geoData=await geoCoder.forwardGeocode(
        {
            query:req.body.camp.location,
            limit:1
        }
    ).send();
    console.log(geoData.body.features);
    const camp=await new Campground(req.body.camp);
    camp.geometry=geoData.body.features[0].geometry;
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author=req.user._id;   
    await camp.save();
    console.log(camp);
    req.flash("success","Successfuly Created a new Campground!");
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.showCampground = async (req,res)=>
{
    const { id }=req.params;
    console.log(id);
    const camp=await Campground.findById(id).populate(
    {
        path:"reviews",
        populate:
        {
            path:"author"
        }
    }
    ).populate("author");
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    console.log(camp);
    res.render("campgrounds/show.ejs",{camp});
}

module.exports.renderEditForm = async (req,res)=>
{
    const { id }=req.params;
    const camp=await Campground.findById(id);
    console.log(camp);
    res.render("campgrounds/edit",{camp});
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.camp });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...imgs);
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${camp._id}`)
}


module.exports.deleteCampground = async (req,res)=>
{
    const { id }=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success","Successfuly Deleted the Campground!");
    res.redirect("/campgrounds");
}