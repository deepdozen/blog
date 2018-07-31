var express = require('express');
var app = express();
//body-parser extract the entire body portion of an incoming request stream and exposes it on req.body.
var bodyParser = require("body-parser");

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({extended: true}));
//A template engine enables you to use static template files in your application.
//At runtime, the template engine replaces variables in a template file with actual values, 
//and transforms the template into an HTML file sent to the client
app.set("view engine", "ejs");

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

//data
var cars = [
  {name: "bmw-m3-cs-2018", image: "https://wallpaper4rest.com/cars/wallpaper/bmw-m3-cs-2018-free-wallpaper_1-800x600.jpg"},
  {name: "bmw-m3-concept-2007", image: "https://wallpaper4rest.com/cars/wallpaper/bmw-m3-concept-2-2007-best-wallpaper_1-800x600.jpeg"},
  {name: "bmw-m3-cs-2018", image: "https://wallpaper4rest.com/cars/wallpaper/bmw-m3-cars-cute-wallpaper_1-800x600.jpg"},
  {name: "bmw-m3-bt92-by-alpha-n-performance-2013", image: "https://wallpaper4rest.com/cars/wallpaper/bmw-m3-bt92-by-alpha-n-performance-2013-cool_1-800x600.jpeg"},
  {name: "bmw-m3-30-years-american-edition", image: "https://wallpaper4rest.com/cars/wallpaper/bmw-m3-30-years-american-edition-4k-2018-cool-hd_1-800x600.jpeg"},
  {name: "bmw-m3-30-jahre-special-edition", image: "https://wallpaper4rest.com/cars/wallpaper/bmw-m3-30-jahre-special-edition-2016-cute_1-800x600.jpeg"}
]; 

// App
app.get('/', (req, res) => {
    res.render("landing");
});

app.get('/cars', (req, res) => {
    res.render("cars",{cars:cars});
});

app.post("/cars", (req, res) => {
    // get data from form and add to cars array
    var name = req.body.name;
    var image = req.body.image;
    var newCar = { name: name, image: image }
    cars.push(newCar);
    //redirect back to cars page
    res.redirect("/cars");
});

app.get("/cars/new", (req, res) => {
    res.render("new.ejs");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);