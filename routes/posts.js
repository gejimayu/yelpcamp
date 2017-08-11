var express = require("express"),
    route   = express.Router(),
    Post = require("../model/post.js"),
    sanitizer   = require("express-sanitizer"),
    middlewareObj = require("../middleware/index.js");
    
route.use(sanitizer());

//New Post
route.get("/new",  middlewareObj.isLoggedIn, function(req, res){
    res.render("post/new.ejs");
});

//Showing a particular Post
route.get("/:id", function(req, res){
    Post.findById(req.params.id).populate("comments").exec(function(err, found) {
        if (err)
            console.log("err");
        else {
            res.render("post/show.ejs", {thePost: found});
        }
    });
});

//Index Page, showing list of posts
route.get("/", function(req, res){
    Post.find({}, function(err, thePosts){
        if (err)
            console.log(err);
        else
            res.render("post/index.ejs", {thePosts: thePosts, page: "posts"});
    })
});

//Post Route Handler, receiving new Post and redirecting to /posts
route.post("/",  middlewareObj.isLoggedIn, function(req, res){
    var name = req.body.post.name;
    var image = req.body.post.image;
    var desc = req.body.post.desc;
    var author = {id: req.user._id, username: req.user.username};
    var newPost = {name: name, image: image, desc: desc, author: author};
    Post.create(newPost, function(err, created){
        if (err) {
            req.flash("error", "Something went wrong :(");
            res.redirect("back");
        }
        else {
            req.flash("success", "Post succesfully added");
            res.redirect("/posts");
            console.log("Succesfully added " + created);
        }
    });
});

//EDIT ROUTE
route.get("/:id/edit",  middlewareObj.authorizePost, function(req, res){
    Post.findById(req.params.id, function(err, thePost){
        if (err) {
            console.log(err);
        }
        else {
            res.render("post/edit.ejs", {thePost: thePost});
        }
    });
});

//UPDATE ROUTE
route.put("/:id",  middlewareObj.authorizePost, function(req, res){
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, thePost){
        if (err) {
            req.flash("error", "Something went wrong :(");
            res.redirect("back");
        }
        else {
            req.flash("success", "Post succesfully edited");
            res.redirect("/posts/" + req.params.id);
        }
    });
});

//DELETE ROUTE
route.delete("/:id",  middlewareObj.authorizePost, function(req, res){
    Post.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            req.flash("error", "Something went wrong :(");
            res.redirect("back");
        }
        else {
            req.flash("success", "Post succesfully deleted");
            res.redirect("/posts");
        }
    });
});

module.exports = route;