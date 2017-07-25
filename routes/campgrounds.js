var express = require("express"),
    route   = express.Router(),
    Campground = require("../model/campground.js"),
    sanitizer   = require("express-sanitizer");
    
route.use(sanitizer());

//New Campground
route.get("/new", isLoggedIn, function(req, res){
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

//EDIT ROUTE
route.get("/:id/edit", authorizeCamp, function(req, res){
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
route.put("/:id", authorizeCamp, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, camp){
        if (err)
            res.send("update failed");
        else
            res.redirect("/campgrounds/" + req.params.id);
    });
});

//DELETE ROUTE
route.delete("/:id", authorizeCamp, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err)
            res.send("delete failed");
        else
            res.redirect("/campgrounds");
    });
});

//middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

function authorizeCamp(req, res, next){
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, camp) {
            if (err)
                res.redirect("back");
            else {
                if (req.user._id.equals(camp.author.id))
                    return next();
                else
                    res.redirect("back");
            }
        });
    }
    else {
        res.redirect("back");
    }
}
module.exports = route;