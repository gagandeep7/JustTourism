var express = require('express')
var router = express.Router()
var passport = require('passport')
var User = require('../models/user')


// redirect to index page
router.get("/", function (req, res) {
  res.render("landing");
});

//=====================
// Auth Routes
// ==================


//show register form
router.get('/register', function (req, res) {
  res.render('register')
})

// show signup logic

router.post('/register', function (req, res) {
  var newUser = new User({ username: req.body.username })
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message)
      return res.render("register")
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "welcome to CampMania :" + user.username)
      res.redirect("/campgrounds")
    })

  })
})


//show login form

router.get('/login', function (req, res) {
  res.render("login")
})

// do login task

router.post('/login', passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: '/login'
}), function (req, res) {

})

//logout 

router.get('/logout', function (req, res) {
  req.logOut()
  req.flash("success", "Logged you out")
  res.redirect('/campgrounds')
})



module.exports = router