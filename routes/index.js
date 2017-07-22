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
            console.log(err);
            return res.render("register.ejs");
        }
        passport.authenticate("local")(req, res, function(){
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
   res.redirect("/campgrounds");
});

module.exports = route;