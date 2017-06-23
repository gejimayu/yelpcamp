var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));

var Campground = mongoose.model(
                 "Campground", 
                 new mongoose.Schema({
                    name: String,
                    image: String, 
                    desc: String
                 })
                 );

// Campground.create(
//     {
//         name: "Granite Hill", 
//         image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg",
//         desc: "It's beautiful !!!!!! Trust me you won't regret this experience."
//     },
//     function(err, created) {
//         if (err)
//             console.log(err);
//         else
//             console.log(created);
//     }
// );

app.get("/", function(req, res){
    res.render("landing.ejs");
})

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
})

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id, function(err, found) {
        if (err)
            console.log(err);
        else
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