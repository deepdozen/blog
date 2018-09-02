var Blog = require("../models/car");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkPostOwnership = (req,res,next)=>{
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, (err, foundPost)=>{
            if(err){
                res.redirect("back");
            } else {
                //check user's ownership of the post 
                if (foundPost.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if (err) {
                res.redirect("back");
            } else {
                //check user's ownership of the post 
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;