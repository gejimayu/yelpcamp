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

//EDIT COMMENT
route.get("/:comment_id/edit", authorizeComment, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err)
            console.log(err);
        else {
            res.render("comment/edit.ejs", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//HANDLE EDIT COMMENT
route.put("/:comment_id", authorizeComment, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
        if (err)
            res.send("update failed");
        else
            res.redirect("/campgrounds/" + req.params.id);
    });
});


//DELETE COMMENT
route.delete("/:comment_id", authorizeComment, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err)
            res.send("deletion failed");
        res.redirect("/campgrounds/" + req.params.id);
    });
});

//middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

function authorizeComment(req, res, next){
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err)
                res.redirect("back");
            else {
                if (req.user._id.equals(foundComment.author.id))
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