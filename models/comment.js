var mongoose = require('mongoose')
// schema 
var commSchema = new mongoose.Schema({
    text : String,
    createdAt:{type: Date, default : Date.now},
    author : {
        id:{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username:String
    }
})
var Comment = mongoose.model("Comment",commSchema)
//export module

module.exports = Comment