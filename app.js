var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./model/campground.js"),
    seedDB      = require("./seeds.js");

seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.render("landing.ejs");
})

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
})

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, found) {
        if (err)
            console.log("err");
        else
            console.log(found);
            res.render("show.ejs", {Camp: found});
    });
})

app.get("/campgrounds", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if (err)
            console.log(err);
        else
            res.render("index.ejs", {campgrounds: campgrounds});
    })
})

app.post("/campgrounds", function(req, res){
    Campground.create(req.body, function(err, created){
        if (err)
            console.log(err);
        else
            console.log("Succesfully added " + created);
    });
    res.redirect("/campgrounds");
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YELP CAMP HAS STARTED!");
})