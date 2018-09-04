var express = require('express');
var app = express();
//body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
//var seedDB = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var User = require("./models/user");
//routes vars
var commentRoutes = require("./routes/comments");
var carRoutes = require("./routes/cars");
var indexRoutes = require("./routes/index");

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({extended: true}));
//A template engine enables you to use static template files in your application.
//At runtime, the template engine replaces variables in a template file with actual values, 
//and transforms the template into an HTML file sent to the client
app.set("view engine", "ejs");
// serve static files for express
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//connect to the mongoDB container
mongoose.connect("mongodb://172.17.0.3:27017/cars_blog", { useNewUrlParser: true },err=>{
  if(err){
    console.log("error. mongoDB not connected");
  }else{
    console.log("mongoDB connected!");
  }
});
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "Secret frase which is used for hash generating",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/cars", carRoutes);
app.use("/cars/:id/comments", commentRoutes);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);