var express = require("express"),
    route   = express.Router({mergeParams: true}),
    Campground = require("../model/campground.js"),
    Comment    = require("../model/comment.js");
    
//Show Comment Form
route.get("/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err)
            console.log(err);
        else
            res.render("comment/new.ejs", {campground: campground});
    });
});

//Handle Comment Logic
route.post("/", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err)
            console.log(err);
        else {
            Comment.create(req.body.comment, function(err, createdComment){
                if (err)
                    console.log(err);
                else {
                    createdComment.author.id = req.user._id;
                    createdComment.author.username = req.user.username;
                    createdComment.save();
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = route;