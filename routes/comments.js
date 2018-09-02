var express = require("express");
var router = express.Router({ mergeParams: true });
var Blog = require("../models/car");
var Comment = require("../models/comment");
var middleware = require("../middleware");


router.get("/new", middleware.isLoggedIn, (req, res) => {
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
router.post("/", middleware.isLoggedIn, (req, res) => {
    Blog.findById(req.params.id, (err, car) => {
        if (err) {
            console.log(err);
            res.redirect("/cars");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    car.comments.push(comment);
                    car.save();
                    res.redirect("/cars/" + car._id);
                }
            });
        }
    });
});

//EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership,(req,res)=>{
    Comment.findById(req.params.comment_id, (err,foundComment)=>{
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {car_id: req.params.id, comment: foundComment});
        }
    });
});

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,(err,updatedComment)=>{
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/cars/" + req.params.id);
        }
    });
});

//DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, (req,res)=>{
    Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/cars/" + req.params.id);
        }
    });
})

module.exports = router;