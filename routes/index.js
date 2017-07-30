var express = require("express"),
    route   = express.Router(),
    passport = require("passport"),
    User = require("../model/user.js");

//Main Page
route.get("/", function(req, res){
    res.render("landing.ejs");
});
    
//show register form
route.get("/register", function(req, res){
    res.render("register.ejs");
});

//handle sign up logic
route.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
route.get("/login", function(req, res){
    res.render("login.ejs");
});

//handle login logic
route.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res){
});

//logout 
route.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "You just logged out");
   res.redirect("/campgrounds");
});

module.exports = route;