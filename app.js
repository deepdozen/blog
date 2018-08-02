var express = require('express');
var app = express();
//body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

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

// SCHEMA SETUP
var blogSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

//data
// var cars = [
//   {name: "bmw-m3-cs-2018", image: "https://wallpaper4rest.com/cars/wallpaper/bmw-m3-cs-2018-free-wallpaper_1-800x600.jpg"},
//   {name: "bmw-m3-concept-2007", image: "https://wallpaper4rest.com/cars/wallpaper/bmw-m3-concept-2-2007-best-wallpaper_1-800x600.jpeg"},
//   {name: "bmw-m3-cs-2018", image: "https://wallpaper4rest.com/cars/wallpaper/bmw-m3-cars-cute-wallpaper_1-800x600.jpg"},
//   {name: "bmw-m3-bt92-by-alpha-n-performance-2013", image: "https://wallpaper4rest.com/cars/wallpaper/bmw-m3-bt92-by-alpha-n-performance-2013-cool_1-800x600.jpeg"},
//   {name: "bmw-m3-30-years-american-edition", image: "https://wallpaper4rest.com/cars/wallpaper/bmw-m3-30-years-american-edition-4k-2018-cool-hd_1-800x600.jpeg"},
//   {name: "bmw-m3-30-jahre-special-edition", image: "https://wallpaper4rest.com/cars/wallpaper/bmw-m3-30-jahre-special-edition-2016-cute_1-800x600.jpeg"}
// ]; 

var Blog = mongoose.model("Blog", blogSchema);

Blog.create(
     {
         name: "bmw-m3-cs-2018", 
         image: "https://wallpaper4rest.com/cars/wallpaper/bmw-m3-cs-2018-free-wallpaper_1-800x600.jpg",
         description: "This is a BMW M3 2018"

     },
     (err, newpost)=>{
      if(err){
          console.log(err);
      } else {
          console.log("NEWLY CREATED POST: ");
        console.log(newpost);
      }
    });

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
        res.render("index", { cars: allCars });
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
    res.render("new.ejs");
});

// SHOW - shows more info about one record
app.get("/cars/:id", (req, res) => {
  //find the record with provided ID
  Blog.findById(req.params.id, (err, foundCar)=>{
    if (err) {
      console.log(err);
    } else {
      //render show template with that campground
      res.render("show", { car: foundCar });
    }
  });
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);