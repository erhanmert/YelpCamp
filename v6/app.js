var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    Comment = require("./models/comment"),
    Campground = require("./models/campground"),
    User = require("./models/user"),
    seedDB = require("./seeds");
    

 
mongoose.connect("mongodb://localhost/yelp_camp",{useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"))

seedDB();

// PASSPORT JS

app.use(require("express-session")({
   secret : "erhan mert gizli kelime",
   resave : false,
   saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

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

app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new");
});

app.get("/campgrounds",function(req,res){
    Campground.find({},function(err, allCampgrounds){
       if(err){
           console.log(err);
       }else
           res.render("campgrounds/index",{campgrounds:allCampgrounds});
    });
});

app.post("/campgrounds",isLoggedIn, function(req,res){
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

//SHOW DETAIL
app.get("/campgrounds/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
       if(err){
           console.log(err);
       }else{
             res.render("campgrounds/show",{campground:foundCampground});
       } 
    });
});


app.get("/campgrounds/:id/comments/new",isLoggedIn ,function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
      if(err){
          console.log(err);
      }else{
             res.render("comments/new",{campground:foundCampground});
      } 
    });
});

app.post("/campgrounds/:id/comments",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
      if(err){
          console.log(err);
          res.redirect("/campgrounds");
      }else{
          Comment.create(req.body.comment, function(err,comment){
             if(err){
                 console.log(err);
                 res.redirect("/campgrounds");
             }else{
                 foundCampground.comments.push(comment);
                 foundCampground.save();
                 res.redirect('/campgrounds/'+foundCampground._id);
             } 
          });
      } 
    });
});


//AUTHENTICATON

app.get("/register",function(req, res) {
    res.render("register");
});

app.post("/register",function(req, res) {
    var newUser = new User({username:req.body.username});
   User.register(newUser,req.body.password,function (err,user) {
       if(err){
           console.log(err);
           return res.render("register");
       }
       passport.authenticate("local")(req,res,function(){
          res.redirect("/campgrounds"); 
       });
   }); 
});

//show login

app.get("/login",function(req, res) {
    res.render("login");
});

app.post("/login",passport.authenticate("local",
{
    successRedirect :"/campgrounds",
    failureRedirect :"/login"
    
}),function(req, res,err) {
    console.log(err);
});

//logout

app.get("/logout" ,function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
    
})


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started");
});