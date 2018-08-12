var express = require('express');
var app = express();
//body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Blog = require("./models/car");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({extended: true}));
//A template engine enables you to use static template files in your application.
//At runtime, the template engine replaces variables in a template file with actual values, 
//and transforms the template into an HTML file sent to the client
app.set("view engine", "ejs");

//connect to the mongoDB container
mongoose.connect("mongodb://172.19.0.2:27017/cars_blog", { useNewUrlParser: true },err=>{
  if(err){
    console.log("error. mongoDB not connected");
  }else{
    console.log("mongoDB connected!");
  }
});
seedDB();

// App root
app.get('/', (req, res) => {
    res.render("landing");
});

//INDEX - show all records
app.get('/cars', (req, res) => {
    //res.render("cars",{cars:cars});
    //Get all cars from DB
    Blog.find({},(err,allCars)=>{
      if (err) {
        console.log(err);
      } else {
        res.render("cars/index", { cars: allCars });
      }
    });
});

//CREATE - Create a new record and save to DB
app.post("/cars", (req, res) => {
    // get data from form and add to cars array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCar = { name: name, image: image, description: desc }
    //cars.push(newCar);
    //Create a new record and save to DB
    Blog.create(newCar, (err, newlyCreated)=>{
      if(err){
          console.log(err);
      } else{
          //redirect back to cars page
          res.redirect("/cars");
      }
    });
});

//NEW - show form to create a new record
app.get("/cars/new", (req, res) => {
    res.render("cars/new.ejs");
});

// SHOW - shows more info about one record
app.get("/cars/:id", (req, res) => {
  //find the record with provided ID
  Blog.findById(req.params.id).populate("comments").exec((err, foundCar)=>{
    if (err) {
      console.log(err);
    } else {
      console.log(foundCar)
      //render show template with that campground
      res.render("cars/show", { car: foundCar });
    }
  });
})

// ====================
// COMMENTS ROUTES
// ====================

app.get("/cars/:id/comments/new",(req,res)=>{
  Blog.findById(req.params.id,(err,car)=>{
    if(err){
      console.log(err);
    }else{
      res.render("comments/new",{car: car});
    }
  })
});

//create new comment
//connect new comment to car
//redirect to show page
app.post("/cars/:id/comments",(req,res)=>{
  Blog.findById(req.params.id, (err, car) => {
    if (err) {
      console.log(err);
      res.redirect("/cars");
    } else {
      Comment.create(req.body.comment,(err,comment)=>{
        if(err){
          console.log(err);
        }else{
          car.comments.push(comment);
          car.save();
          res.redirect("/cars/" + car._id);
        }
      });
    }
  });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);