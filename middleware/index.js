var Campground = require('../models/campModel')
var Comment = require('../models/comment')

// all middlewares
let middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
  // check logged in
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      if (err) {
        req.flash("error", "Campground not found")

        res.redirect("back")
      }
      // check if author is same as logged in user
      if (foundCampground.author.id.equals(req.user._id)) {
        next()
      }
      else {
        req.flash("error","You dont have permission")
        res.redirect("back")
      }

    })
  }
  else {
    req.flash("error", "You need to be logged in")
    res.redirect("back")
  }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function (err, foundComment) {
      if (err) {
        res.redirect("back")

      }
      // check authorization
      if (foundComment.author.id.equals(req.user._id)) {
        next()
      }
      else {
        req.flash("error","you dont have permission to do that")
        res.redirect("back")
      }
    })
  }
  else {
    req.flash("error","You need to be logged in")
    res.redirect("back")

  }
}


middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  // use flash before redirecting and then handle in route
  req.flash("error", "You need to be logged in ")
  res.redirect('/login')
}

module.exports = middlewareObj