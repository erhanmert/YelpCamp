var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnerShip= function(req,res,next){
        if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground) {
           if(err){
               req.flash("error","campground not found");
               res.redirect("back");
           }  else {
               if(foundCampground.author.id.equals(req.user._id)){
                   next();
               }else{
                    req.flash("error","You do not have permission");
                    res.redirect("back");
               }
           }
        });
    }else{
        req.flash("error","You need to be logged in")
        res.redirect("back");

    }
}


middlewareObj.checkCommentOwnerShip= function(req,res,next){
        if(req.isAuthenticated()){
        Comment.findById(req.params.id, function(err, foundComment) {
           if(err){
               res.redirect("back");
           }  else {
               if(foundComment.author.id.equals(req.user._id)){
                   next();
               }else{
                    req.flash("error","You do not have permission");
                    res.redirect("back");
               }
           }
        });
    }else{
        req.flash("error","You need login");
        res.redirect("back");

    }
}

middlewareObj.isLoggedIn = function(req,res,next) {
        if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in");
    res.redirect("/login");
}


module.exports = middlewareObj
