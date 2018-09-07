var express = require("express");
var router = express.Router();
var Blog = require("../models/car");
var middleware = require("../middleware");

var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);

//INDEX - show all records
router.get('/', (req, res) => {
    //res.render("cars",{cars:cars});
    //Get all cars from DB
    Blog.find({}, (err, allCars) => {
        if (err) {
            console.log(err);
        } else {
            res.render("cars/index", { cars: allCars, page: 'cars' });
        }
    });
});

//CREATE - Create a new record and save to DB
router.post("/", middleware.isLoggedIn, (req, res) => {
    // get data from form and add to cars array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }

    geocoder.geocode(req.body.location, (err, data)=>{
        if (err || !data.length) {
            console.log(err);
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newCar = { name: name, price: price, image: image, description: desc, author: author, location: location, lat: lat, lng: lng };
        //cars.push(newCar);
        //Create a new record and save to DB
        Blog.create(newCar, (err, newlyCreated) => {
            if (err) {
                console.log(err);
            } else {
                //redirect back to cars page
                res.redirect("/cars");
            }
        });
    });
});

//NEW - show form to create a new record
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("cars/new.ejs");
});

// SHOW - shows more info about one record
router.get("/:id", (req, res) => {
    //find the record with provided ID
    Blog.findById(req.params.id).populate("comments").exec((err, foundCar) => {
        if (err || !foundCar) {
            console.log(err);
            req.flash('error', 'Sorry, that post does not exist!');
            res.redirect("/cars");
        } else {
            console.log(foundCar)
            //render show template with that post
            res.render("cars/show", { car: foundCar });
        }
    });
})

//EDIT ROUTE
router.get("/:id/edit", middleware.isLoggedIn, middleware.checkPostOwnership, (req,res)=>{
    Blog.findById(req.params.id, (err,foundCar)=>{
        res.render("cars/edit",{car: foundCar});
    });
});

//UPDATE ROUTE
router.put("/:id",middleware.checkPostOwnership, (req,res)=>{
    geocoder.geocode(req.body.location, (err, data)=>{
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.car.lat = data[0].latitude;
        req.body.car.lng = data[0].longitude;
        req.body.car.location = data[0].formattedAddress;    
        
        Blog.findByIdAndUpdate(req.params.id, req.body.car, (err, updateCar) => {
            if (err) {
                res.redirect("/cars");
            } else {
                req.flash("success", "Post successfully updated");
                res.redirect("/cars/" + updateCar._id);
            }
        });        
    });
});

//DELETE ROUTE
router.delete("/:id",middleware.checkPostOwnership,(req,res)=>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/cars");
        } else {
            req.flash("success", "Post successfully deleted");
            res.redirect("/cars");
        }
    })
})

module.exports = router;