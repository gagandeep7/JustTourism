
var express = require('express')
var router = express.Router()
var Campground = require('../models/campModel')
var Comment = require('../models/comment')
var middleware = require('../middleware')




// ================================
// COMMENT ROUTES
//==================================

//NEW 

router.get('/campgrounds/:id/comment/new',middleware.isLoggedIn ,function (req, res) {
    Campground.findById(req.params.id, function (err, camp) {
      if (err) {
        res.render("/campgrounds")
      }
      else {
        res.render("comment/new", { campground: camp })
      }
    })
  
  
  })
  // Create
  
router.post("/campgrounds/:id/comment",middleware.isLoggedIn ,function (req, res) {
    // find id
    Campground.findById(req.params.id, function (err, camp) {
  
      if (err) {
        res.redirect("/campgrounds/" + req.params.id)
      }
      else {
  
        Comment.create(req.body.comment, function (err, comment) {
          if (err) {
            res.redirect("/campgrounds/" + req.params.id)
          }
          else {
            // add username and id to comment
            comment.author.id = req.user._id
            comment.author.username = req.user.username
            comment.save()
            camp.comment.push(comment)
            camp.save()
            console.log(comment)
            req.flash("success","Comment added successfully")
            res.redirect(("/campgrounds/" + req.params.id))
          }
  
        })
      }
  
  
    })
  })
  
// EDIT

//show edit form
router.get("/campgrounds/:id/comment/:comment_id/edit",middleware.checkCommentOwnership,function(req,res)
{
  // find comment id 
  Comment.findById(req.params.comment_id,function(err,foundComment){
    if(err)
    {
      console.log(err)
      console.redirect("back")
    }
    // pass campground and comment id
    res.render("comment/edit",{camp_id : req.params.id,comment:foundComment })
  })
  
})

// update comment 

router.put("/campgrounds/:id/comment/:comment_id",middleware.checkCommentOwnership,function(req,res)
{
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
    if(err)
    {
      res.redirect("back")
    }
    res.redirect("/campgrounds/"+req.params.id)
  })
})

//Destroy comment

router.delete("/campgrounds/:id/comment/:comment_id",middleware.checkCommentOwnership,function(req,res)
{
 
  Comment.findByIdAndRemove(req.params.comment_id,function(err){
    if(err)
    {
      console.log(err)
      res.redirect("back")
    }
    req.flash("success","comment deleted")
    res.redirect("/campgrounds/" + req.params.id)
  }
)})


  module.exports = router
