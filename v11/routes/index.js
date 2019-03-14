var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user")

router.get("/",function(req,res){
    res.render("landing");
});

//AUTHENTICATON

router.get("/register",function(req, res) {
    res.render("register");
});

router.post("/register",function(req, res) {
    var newUser = new User({username:req.body.username});
   User.register(newUser,req.body.password,function (err,user) {
       if(err){
           req.flash("error",err.message);
           return res.render("register");
       }
       passport.authenticate("local")(req,res,function(){
           req.flash("success","wellcome to yelpcamp "+user.username);
           res.redirect("/campgrounds"); 
       });
   }); 
});

//show login
router.get("/login",function(req, res) {
    res.render("login");
});

router.post("/login",passport.authenticate("local",
{
    successRedirect :"/campgrounds",
    failureRedirect :"/login"
    
}),function(req, res,err) {
    console.log(err);
});

//logout
router.get("/logout" ,function(req, res) {
    req.logout();
    req.flash("error","you logged out");
    res.redirect("/campgrounds");
    
});

module.exports = router;
