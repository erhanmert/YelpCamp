var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new",middleware.isLoggedIn ,function(req,res){
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

//comment edit
router.get("/:comment_id/edit", middleware.checkCommentOwnerShip , function(req, res){
    Comment.findById(req.params.comment_id, function(err,foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {campground_id:req.params.id,comment:foundComment})
        }
    })
    
});
//comment update
router.put("/:comment_id", middleware.checkCommentOwnerShip, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
});
//comment delete
router.delete("/:comment_id" , middleware.checkCommentOwnerShip, function (req,res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});


module.exports = router;
