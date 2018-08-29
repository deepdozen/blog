var express = require("express");
var router = express.Router({ mergeParams: true });
var Blog = require("../models/car");
var Comment = require("../models/comment");


router.get("/new", isLoggedIn, (req, res) => {
    Blog.findById(req.params.id, (err, car) => {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { car: car });
        }
    })
});

//create new comment
//connect new comment to car
//redirect to show page
router.post("/", isLoggedIn, (req, res) => {
    Blog.findById(req.params.id, (err, car) => {
        if (err) {
            console.log(err);
            res.redirect("/cars");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    car.comments.push(comment);
                    car.save();
                    res.redirect("/cars/" + car._id);
                }
            });
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;