var mongoose =require("mongoose");
var Comment = require("./models/comment");
var Campground = require("./models/campground");


var data = [
    {
        name:"ankara",
        image:"https://images.unsplash.com/photo-1524494860062-9442631ee30e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80",
        description:"bla bla"
    },
    {
        name:"istanbul",
        image:"https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description:"bla bla"
        
    },
    {
        name:"antalya",
        image:"https://images.unsplash.com/photo-1527786356703-4b100091cd2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=967&q=80",
        description:"bla bla"
        
    }
    ]

function seedDB(){
    Campground.remove({}, function (err) {
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds");
        data.forEach(function(seed){
        Campground.create(seed,function(err,campground){
            if(err){
                console.log(err);
            }else{
                console.log("campg added");
                Comment.create(
                    {
                        text:"this is great",
                        author:"Homer"
                    },function (err, comment) {
                        if(err){
                            console.log(err);
                        }else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log("created new comment");
                        }
                    });
            }
        });
    });
    });
    

}

module.exports = seedDB;