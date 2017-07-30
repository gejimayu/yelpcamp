var express = require("express"),
    route   = express.Router({mergeParams: true}),
    Campground = require("../model/campground.js"),
    Comment    = require("../model/comment.js"),
    middlewareObj = require("../middleware/index.js");
    
//Show Comment Form
route.get("/new", middlewareObj.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err)
            console.log(err);
        else
            res.render("comment/new.ejs", {campground: campground});
    });
});

//Handle Comment Logic
route.post("/", middlewareObj.isLoggedIn, function(req, res){
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
                    req.flash("success", "Comment succesfully added");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

//EDIT COMMENT
route.get("/:comment_id/edit", middlewareObj.authorizeComment, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if (err)
            console.log(err);
        else {
            res.render("comment/edit.ejs", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//HANDLE EDIT COMMENT
route.put("/:comment_id", middlewareObj.authorizeComment, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, foundComment){
        if (err) {
            req.flash("error", "Comment not found");
            res.redirect("back");
        }
        else {
            req.flash("success", "Comment succesfully edited");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


//DELETE COMMENT
route.delete("/:comment_id",  middlewareObj.authorizeComment, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }
        req.flash("success", "Comment succesfully deleted");
        res.redirect("/campgrounds/" + req.params.id);
    });
});

module.exports = route;