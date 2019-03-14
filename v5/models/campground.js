var mongoose = require("mongoose");
var campgroundSchema = new mongoose.Schema({
   name:String,
   image:String,
   description:String,
   comments:[
      {
         type:String,
         ref:"Comment"
      }
      ]
});

module.exports =  mongoose.model("Campground",campgroundSchema);