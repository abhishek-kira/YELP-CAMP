const mongoose=require("mongoose");
const Campground=require("../models/campground");
const cities=require("./city.js");
const {descriptors,places}=require("./seedHelper.js");

mongoose.connect('mongodb+srv://abhishek_kira:surendra@cluster0.thtt3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB=async ()=>
{
await Campground.deleteMany({});
for(let i=0;i<20;i++)
    {
        const camp=new Campground(
        {
            author:"61e46a031138732c159e359f",
            title:`${descriptors[Math.floor((Math.random())*10)]} ${places[Math.floor((Math.random())*22)]}`,
            location:`${cities[Math.floor(Math.random()*100)].state} , ${cities[Math.floor(Math.random()*100)].city}`,
            images:
            [
                {
                    url:"https://res.cloudinary.com/dt42kz7z1/image/upload/v1642405768/YelpCamp/giphy_1_bvghfn.webp",
                    filename:"YelpCamp/giphy_neyest.webp"
                }
            ],
            geometry:
            {
                type: "Point",
                coordinates: [  cities[Math.floor(Math.random()*100)].longitude,
                                cities[Math.floor(Math.random()*100)].latitude
                             ]
            },    
            price:Math.floor(Math.random()*20),
            description:"Touring Upper Canada Village is a magical experience, transporting you back in time to the 1860s. A key part of the experience is the authentic buildings that make up the village, the activities that each housed, and of course, the people who lived there."
        }
        )
        await camp.save();
    }
}

seedDB().then(()=>
{
    mongoose.connection.close();
})

