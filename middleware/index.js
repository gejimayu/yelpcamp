var Campground  = require("../model/campground.js"),
    Comment     = require("../model/comment.js");

var middlewareObj = {
    isLoggedIn: function (req, res, next){
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error", "You have to log in first");
        res.redirect("/login");
    },
    authorizeCamp: function (req, res, next){
        if (req.isAuthenticated()) {
            Campground.findById(req.params.id, function(err, camp) {
                if (err) {
                    req.flash("error", "Campground not found");
                    res.redirect("back");
                }
                else {
                    if (req.user._id.equals(camp.author.id)) {
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