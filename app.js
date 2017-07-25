var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStratey    = require("passport-local"),
    Campground      = require("./model/campground.js"),
    Comment         = require("./model/comment.js"),
    User            = require("./model/user.js"),
    seedDB          = require("./seeds.js"),
    methodOverride  = require("method-override");
    
//requiring routes
var idxRoute    = require("./routes/index.js"),
    commentRoute = require("./routes/comments.js"),
    campgroundRoute = require("./routes/campgrounds.js");

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

app.use(methodOverride('_method'));

app.use('/', idxRoute);
app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds/:id/comments', commentRoute);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YELP CAMP HAS STARTED!");
});