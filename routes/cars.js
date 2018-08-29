var express = require("express");
var router = express.Router();
var Blog = require("../models/car");

//INDEX - show all records
router.get('/', (req, res) => {
    //res.render("cars",{cars:cars});
    //Get all cars from DB
    Blog.find({}, (err, allCars) => {
        if (err) {
            console.log(err);
        } else {
            res.render("cars/index", { cars: allCars });
        }
    });
});

//CREATE - Create a new record and save to DB
router.post("/", (req, res) => {
    // get data from form and add to cars array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCar = { name: name, image: image, description: desc }
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

//NEW - show form to create a new record
router.get("/new", (req, res) => {
    res.render("cars/new.ejs");
});

// SHOW - shows more info about one record
router.get("/:id", (req, res) => {
    //find the record with provided ID
    Blog.findById(req.params.id).populate("comments").exec((err, foundCar) => {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCar)
            //render show template with that campground
            res.render("cars/show", { car: foundCar });
        }
    });
})

module.exports = router;