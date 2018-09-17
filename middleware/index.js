var Blog = require("../models/car");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkPostOwnership = (req,res,next)=>{
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, (err, foundPost)=>{
            if (err || !foundPost){
                req.flash('error', 'Sorry, that post does not exist!');
                res.redirect("back");
            } else {
                //check user's ownership of the post 
                if (foundPost.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
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
            if (err || !foundComment) {
                req.flash('error', 'Sorry, that comment does not exist!');
                res.redirect("back");
            } else {
                //check user's ownership of the post 
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;