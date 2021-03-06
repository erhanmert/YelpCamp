var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment")

router.get("/new",isLoggedIn ,function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
      if(err){
          console.log(err);
      }else{
             res.render("comments/new",{campground:foundCampground});
      } 
    });
});

router.post("/",function(req,res){
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
                 comment.author.id = req.user._id;
                 comment.author.username = req.user.username;
                 comment.save();
                 foundCampground.comments.push(comment);
                 foundCampground.save();
                 res.redirect('/campgrounds/'+foundCampground._id);
             } 
          });
      } 
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
