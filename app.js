var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./model/campground.js"),
    Comment     = require("./model/comment.js"),
    seedDB      = require("./seeds.js");

//setting up database
seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//-----CAMPGROUND ROUTE--------------

//Main Page
app.get("/", function(req, res){
    res.render("landing.ejs");
});

//New Campground
app.get("/campgrounds/new", function(req, res){
    res.render("campground/new.ejs");
});

//Showing a particular campground
app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, found) {
        if (err)
            console.log("err");
        else
            res.render("campground/show.ejs", {Camp: found});
    });
});

//Index Page, showing list of campgrounds
app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if (err)
            console.log(err);
        else
            res.render("campground/index.ejs", {campgrounds: campgrounds});
    })
});

//Post Route, receiving new campground and redirecting to /campgrounds
app.post("/campgrounds", function(req, res){
    Campground.create(req.body.campground, function(err, created){
        if (err)
            console.log(err);
        else
            console.log("Succesfully added " + created);
    });
    res.redirect("/campgrounds");
});

//--------COMMENT ROUTE---------
app.get("/campgrounds/:id/comments/new", function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err)
            console.log(err);
        else
            res.render("comment/new.ejs", {campground: campground});
    });
});

app.post("/campgrounds/:id/comments", function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err)
            console.log(err);
        else {
            Comment.create(req.body.comment, function(err, createdComment){
                if (err)
                    console.log(err);
                else {
                    foundCampground.comments.push(createdComment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YELP CAMP HAS STARTED!");
});