var Post  = require("../model/post.js"),
    Comment     = require("../model/comment.js");

var middlewareObj = {
    isLoggedIn: function (req, res, next){
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You have to log in first");
        res.redirect("/login");
    },
    authorizePost: function (req, res, next){
        if (req.isAuthenticated()) {
            Post.findById(req.params.id, function(err, pos) {
                if (err) {
                    req.flash("error", "Post not found");
                    res.redirect("back");
                }
                else {
                    if (req.user._id.equals(pos.author.id)) {
                        return next();
                    } 
                    else {
                        req.flash("error", "You don't have permission to do this");
                        res.redirect("back");
                    }
                }
            });
        }
        else {
            req.flash("error", "You have to log in first");
            res.redirect("back");
        }
    },
    authorizeComment: function (req, res, next){
        if (req.isAuthenticated()) {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if (err) {
                    req.flash("error", "Comment not found");
                    res.redirect("back");
                }
                else {
                    if (req.user._id.equals(foundComment.author.id)) {
                        return next();
                    }
                    else {
                        req.flash("error", "You don't have permission to do this");
                        res.redirect("back");
                    }
                }
            });
        }
        else {
            req.flash("error", "You have to log in first");
            res.redirect("back");
        }
    }
};

module.exports = middlewareObj;