var Campground  = require("../model/campground.js"),
    Comment     = require("../model/comment.js");

var middlewareObj = {
    isLoggedIn: function (req, res, next){
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/login");
    },
    authorizeCamp: function (req, res, next){
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
    },
    authorizeComment: function (req, res, next){
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
};

module.exports = middlewareObj;