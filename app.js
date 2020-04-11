let express = require("express"),
  app = express(),
  request = require("request"),
  flash = require('connect-flash'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  methodOverride  = require('method-override')
  passportLocalMongoose = require('passport-local-mongoose'),
  mongoose = require("mongoose"),
  bodyParser = require("body-parser")

// Routes import
var commentRoutes           =    require('./routes/comment'),
    campgroundRoutes        =    require('./routes/campground'),
    indexRoutes             =    require('./routes/index')
  

// seeddb at every time server start clear and insert data
let seedDB = require('./seed')

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))
app.use(methodOverride('_method'))
app.use(flash())
// seedDB()

// importing model
let Comment = require('./models/comment')
let Campground = require('./models/campModel')
let User = require('./models/user')


//==============
// PASSPORT CONFIG
//================

// session management
app.use(require("express-session")({
  secret: "cr7 is best",
  resave: false,
  saveUninitialized: false
}))

// passport methods

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// *Now moment is available for use in all of your view files via the variable named moment
app.locals.moment = require('moment')

// stores username and id passport.js
app.use(function(req,res,next){
  // use obj in ejs templates 
  res.locals.obj = req.user
  // flash objs  for all ejs files 
  res.locals.error = req.flash("error")
  res.locals.success = req.flash("success")
  next()
})

// database
mongoose.connect("mongodb+srv://gag7:ronaldo786@yelp-ixz5i.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


//ROutes

app.use(indexRoutes)
app.use(campgroundRoutes)
app.use(commentRoutes)


// listen 
app.listen(process.env.PORT || 3001, function () {
  console.log("server start");
});
 