
if(process.env.NODE_ENV!=="production")
{
    require("dotenv").config();
}

const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const methodoverride=require("method-override");
const AppError=require("./utils/AppError");
const ejsMate=require("ejs-mate");  //For layout
const campgroundRoutes=require("./routes/campground_routes");
const reviewRoutes=require("./routes/review_routes");
const session=require("express-session");
const flash=require("connect-flash");   
const passport=require("passport")
const LocalStrategy=require("passport-local")
const User=require("./models/user");
const userRoutes=require("./routes/user_routes")
const mongoSanitize=require("express-mongo-sanitize");

const MongoDBStore = require("connect-mongodb-session")(session);

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl)
.then(()=>
{
    console.log("Mongo Connection sucessfull");
})
.catch((err)=>
{
    console.log("Mongo Connection Error");
    console.log(err);
}
)

app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true}));

app.use(methodoverride("_method"));

app.use(express.static(path.join(__dirname,"public")));
app.use(mongoSanitize({
    replaceWith: '_'
}))

const secret = process.env.SECRET || 'secret';

const store =new MongoDBStore(
    {
        url:dbUrl,
        secret,
        touchAfter:24*3600
    }
)

const sessionConfig=
{
    store,
    name:"session",
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:
    {
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use("/",userRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id",reviewRoutes);   

//Home Pages
app.get("/",(req,res)=>
{
    res.render("home");
})

//Error Handling
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port=process.env.PORT || 3000;
//Starting Server
app.listen(port,(req,res)=>
{
    console.log(`Server on ${port}`);
})
