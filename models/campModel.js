// monggose require
mongoose = require("mongoose");
// Schema Setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    price:String,
    image: String,
    description: String,
    createdAt:{type: Date, default : Date.now},
    author : {
      id:{
          type : mongoose.Schema.Types.ObjectId,
          ref : "User"
      },
      username:String
  },
    comment : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Comment'
    }]
  });




  //Model Setup

var Campground = mongoose.model("Campground", campgroundSchema);

// exports 

module.exports = Campground