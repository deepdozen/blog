var express = require("express");
var router = express.Router();
var Blog = require("../models/car");
var middleware = require("../middleware");

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
router.post("/", middleware.isLoggedIn, (req, res) => {
    // get data from form and add to cars array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCar = { name: name, image: image, description: desc, author:author }
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
router.get("/new", middleware.isLoggedIn, (req, res) => {
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
            //render show template with that post
            res.render("cars/show", { car: foundCar });
        }
    });
})

//EDIT ROUTE
router.get("/:id/edit", middleware.checkPostOwnership, (req,res)=>{
    Blog.findById(req.params.id, (err,foundCar)=>{
        res.render("cars/edit",{car: foundCar});
    });
});

//UPDATE ROUTE
router.put("/:id",middleware.checkPostOwnership, (req,res)=>{
    Blog.findByIdAndUpdate(req.params.id, req.body.car, (err,updateCar)=>{
        if(err){
            res.redirect("/cars");
        } else {
            res.redirect("/cars/"+req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete("/:id",middleware.checkPostOwnership,(req,res)=>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/cars");
        } else {
            res.redirect("/cars");
        }
    })
})

module.exports = router;