var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// App root
router.get('/', (req, res) => {
    res.render("landing");
});

// show register form
router.get("/register", (req, res) => {
    res.render("register", { page: 'register' });
});

//sign up logic
router.post("/register", (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render("register", { error: err.message });
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to Blog " + user.username);
            res.redirect("/cars");
        });
    });
});

//show login form
router.get("/login", (req, res) => {
    res.render("login", { page: 'login' });
});

//login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/cars",
    failureRedirect: "/login"
}), (req, res) => { }
);

//logout logic
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/cars");
});

module.exports = router;