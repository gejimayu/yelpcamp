var express = require("express"),
    route   = express.Router(),
    Campground = require("../model/campground.js"),
    sanitizer   = require("express-sanitizer"),
    middlewareObj = require("../middleware/index.js");
    
route.use(sanitizer());

//New Campground
route.get("/new",  middlewareObj.isLoggedIn, function(req, res){
    res.render("campground/new.ejs");
});

//Showing a particular campground
route.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, found) {
        if (err)
            console.log("err");
        else {
            res.render("campground/show.ejs", {Camp: found});
        }
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
route.post("/",  middlewareObj.isLoggedIn, function(req, res){
    var name = req.body.campground.name;
    var image = req.body.campground.image;
    var desc = req.body.campground.desc;
    var author = {id: req.user._id, username: req.user.username};
    var newCampground = {name: name, image: image, desc: desc, author: author};
    Campground.create(newCampground, function(err, created){
        if (err) {
            req.flash("error", "Something went wrong :(");
            res.redirect("back");
        }
        else {
            req.flash("success", "Campground succesfully added");
            res.redirect("/campgrounds");
            console.log("Succesfully added " + created);
        }
    });
});

//EDIT ROUTE
route.get("/:id/edit",  middlewareObj.authorizeCamp, function(req, res){
    Campground.findById(req.params.id, function(err, camp){
        if (err) {
            console.log(err);
        }
        else {
            res.render("campground/edit.ejs", {camp: camp});
        }
    });
});

//UPDATE ROUTE
route.put("/:id",  middlewareObj.authorizeCamp, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, camp){
        if (err) {
            req.flash("error", "Something went wrong :(");
            res.redirect("back");
        }
        else {
            req.flash("success", "Campground succesfully edited");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE ROUTE
route.delete("/:id",  middlewareObj.authorizeCamp, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            req.flash("error", "Something went wrong :(");
            res.redirect("back");
        }
        else {
            req.flash("success", "Campground succesfully deleted");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = route;