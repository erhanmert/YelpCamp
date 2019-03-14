var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    
    
mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");


//schema setup
var campgroundSchema = new mongoose.Schema({
   name:String,
   image:String,
   description:String
});

var Campground = mongoose.model("Campground",campgroundSchema);

// Campground.create(
//     {name:"grant hill",
//     image:"https://i.kym-cdn.com/photos/images/newsfeed/000/514/870/226.ashx",description:"sdasdasd"},
//     function(err,campground){
//     if(err){
//         console.log(err);
//     }else{
//         console.log(campground);
//     }
// });


app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err, allCampgrounds){
       if(err){
           console.log(err);
       }else
           res.render("index",{campgrounds:allCampgrounds});
    });
});

app.post("/campgrounds",function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;

    var newCampground= {name:name,image:image,description:description};
    Campground.create(newCampground,function(err,newlyCampground){
        if(err){
            console.log(err);
        }
    });
    res.redirect("/campgrounds");
    
    
    res.send("post");
});

app.get("/campgrounds/new",function(req,res){
    res.render("new");
});

app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id,function(err,foundCampground){
       if(err){
           console.log(err);
       }else{
             res.render("show",{campground:foundCampground});
       } 
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
});