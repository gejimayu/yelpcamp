var express = require("express");
var app = express();

app.get("/", function(req, res){
    res.render("landing.ejs");
})

app.get("/campgrounds", function(req, res){
    var campgrounds = [
        {name: "Granite Hill", image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg"},
        {name: "Salmon Creek", image: "https://farm3.staticflickr.com/2535/3823437635_c712decf64.jpg"},
        {name: "Mountain Goat", image: "https://farm4.staticflickr.com/3273/2602356334_20fbb23543.jpg"}
    ];
    res.render("campgrounds.ejs", {campgrounds: campgrounds});
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YELP CAMP HAS STARTED!");
})