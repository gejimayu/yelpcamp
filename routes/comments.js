var express = require("express"),
    route   = express.Router({mergeParams: true}),
    Post = require("../model/post.js"),
    Comment    = require("../model/comment.js"),
    middlewareObj = require("../middleware/index.js");
    
//Show Comment Form
route.get("/new", middlewareObj.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, thePost){
        if (err)
            console.log(err);
        else
            res.render("comment/new.ejs", {thePost: thePost});
    });
});

//Handle Comment Logic
route.post("/", middlewareObj.isLoggedIn, function(req, res){
    Post.findById(req.params.id, function(err, foundPost){
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
                    foundPost.comments.push(createdComment);
                    foundPost.save();
                    req.flash("success", "Comment succesfully added");
                    res.redirect("/posts/" + req.params.id);
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
            res.render("comment/edit.ejs", {post_id: req.params.id, comment: foundComment});
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
            res.redirect("/posts/" + req.params.id);
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
        res.redirect("/posts/" + req.params.id);
    });
});

module.exports = route;