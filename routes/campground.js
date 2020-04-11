var express = require('express')
var router = express.Router()
var Campground = require('../models/campModel')
var middleware = require('../middleware')

// NEW

router.get("/campgrounds/new", middleware.isLoggedIn, function (req, res) {
  res.render("campground/new");
});


// INDEX
router.get("/campgrounds", function (req, res) {
  // get campground from db

  // if logged in passport put user id in user obj other wise it is undefined req.user
  console.log(req.user)

  Campground.find({}, function (err, allcampgrounds) {
    if (err) {
      console.log(err)
    }
    else {
      res.render("campground/index", { data: allcampgrounds });
    }
  })


});


// CREATE 

router.post("/campgrounds", middleware.isLoggedIn, function (req, res) {
  var name = req.body.name;
  var price = req.body.price
  var image = req.body.image;
  var desc = req.body.description;
  // link author with camp
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newcamp = { name: name, price:price, image: image, description: desc, author: author };

  // create new camp and save to db

  Campground.create(newcamp, function (err, camp) {
    if (err) {
      console.log(err);
    } else {

      console.log(camp)
      res.redirect("/campgrounds");
    }
  })
});

// SHOW 

router.get('/campgrounds/:id', function (req, res) {
  // find the particular id
  var id = req.params.id
  Campground.findById(id).populate("comment").exec(function (err, foundcamp) {
    if (err) {
      console.log(err)
    }
    else {


      // show content for that id

      res.render("campground/show", { data: foundcamp })
    }
  })
}
)

// EDIT CAMPGROUND ROUTE 
router.get('/campgrounds/:id/edit',middleware.checkCampgroundOwnership ,function (req, res) {

  Campground.findById(req.params.id, function (err, foundCampground) {
    if (err) {
      console.log(err)
      res.redirect("/campgrounds")
    }
    else {
      res.render("campground/edit", { Campground: foundCampground })

    }
  })
})



// UPDATE CAMPGROUND

router.put("/campgrounds/:id",middleware.checkCampgroundOwnership ,function (req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedcamp) {
    if (err) {
      res.redirect("/campgrounds")
    }
    else {
      req.flash("success","Update Successfully")
      res.redirect("/campgrounds/" + req.params.id)
    }
  }
  )
})


// Destrot Route

router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership ,function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds")
    }
    else {
      req.flash("success","Delete Successfully")
      res.redirect("/campgrounds")
    }
  })
})



module.exports = router