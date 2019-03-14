var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");

var campgrounds =  [
    {name:"kızılcahamam" ,image:"https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg" },
    {name:"karakaya" ,image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
    {name:"karakaya" ,image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
    {name:"karakaya" ,image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
    {name:"karakaya" ,image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
    {name:"karakaya" ,image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
    {name:"karakaya" ,image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
    {name:"karakaya" ,image:"https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg"},
    {name:"karagol" ,image:"https://farm9.staticflickr.com/8041/7930201874_6c17ed670a.jpg"}
];

app.get("/",function(req,res){
    res.render("landing");
});

app.get("/campgrounds",function(req,res){

    
    res.render("campgrounds",{campgrounds:campgrounds});
});

app.post("/campgrounds",function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampground= {name:name,image:image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
    
    res.send("post");
});

app.get("/campgrounds/new",function(req,res){
    res.render("new");
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
});