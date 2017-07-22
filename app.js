var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStratey    = require("passport-local"),
    Campground      = require("./model/campground.js"),
    Comment         = require("./model/comment.js"),
    User            = require("./model/user.js"),
    seedDB          = require("./seeds.js");

//setting up database
seedDB();
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Setting Up Passport
app.use(require("express-session")({
    secret: "wowowow",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratey(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});
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
//Show Comment Form
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err)
            console.log(err);
        else
            res.render("comment/new.ejs", {campground: campground});
    });
});
//Handle Comment Logic
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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

//--------AUTH ROUTE-------
//show register form
app.get("/register", function(req, res){
    res.render("register.ejs");
});

//handle sign up logic
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if (err) {
            console.log(err);
            return res.render("register.ejs");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form
app.get("/login", function(req, res){
    res.render("login.ejs");
});

//handle login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }), function(req, res){
});

//logout 
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});

//middleware
function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YELP CAMP HAS STARTED!");
});