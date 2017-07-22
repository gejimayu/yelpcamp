var express = require("express"),
    route   = express.Router(),
    Campground = require("../model/campground.js");

//New Campground
route.get("/new", isLoggedIn, function(req, res){
    res.render("campground/new.ejs");
});

//Showing a particular campground
route.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, found) {
        if (err)
            console.log("err");
        else
            res.render("campground/show.ejs", {Camp: found});
    });
});

//Index Page, showing list of campgrounds
route.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if (err)
            console.log(err);
        else
            res.render("campground/index.ejs", {campgrounds: campgrounds});
    })
});

//Post Route Handler, receiving new campground and redirecting to /campgrounds
route.post("/", isLoggedIn, function(req, res){
    var name = req.body.campground.name;
    var image = req.body.campground.image;
    var desc = req.body.campground.desc;
    var author = {id: req.user._id, username: req.user.username};
    var newCampground = {name: name, image: image, desc: desc, author: author};
    Campground.create(newCampground, function(err, created){
        if (err)
            console.log(err);
        else
            console.log("Succesfully added " + created);
    });
    res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = route;