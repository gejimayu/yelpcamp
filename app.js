var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    flash           = require("connect-flash"),
    LocalStratey    = require("passport-local"),
    Post           = require("./model/post.js"),
    Comment         = require("./model/comment.js"),
    User            = require("./model/user.js"),
    seedDB          = require("./seeds.js"),
    methodOverride  = require("method-override");
    
//requiring routes
var idxRoute    = require("./routes/index.js"),
    commentRoute = require("./routes/comments.js"),
    postRoute = require("./routes/posts.js");

//setting up database
seedDB();
mongoose.connect("mongodb://localhost/post_db");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//Setting Up Passport
app.use(require("express-session")({
    secret: "wowowow",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratey(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.errorMsg = req.flash("error");
    res.locals.successMsg = req.flash("success");
    next();
});
app.use(methodOverride('_method'));

app.use('/', idxRoute);
app.use('/posts', postRoute);
app.use('/posts/:id/comments', commentRoute);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("WEBSITE HAS STARTED!");
});