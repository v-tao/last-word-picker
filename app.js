const express   	 = require("express"),
	  app 	    	 = express(),
	  mongoose  	 = require("mongoose"),
	  Class     	 = require("./models/class"),
	  Student 		 = require("./models/student"),
	  User 			 = require("./models/user"),
	  bodyParser 	 = require("body-parser"),
	  methodOverride = require("method-override"),
	  $ 			 = require("jquery"),
	  passport 		 = require("passport"),
	  LocalStrategy  = require("passport-local"),
      flash			 = require("connect-flash");

const classRoutes   = require("./routes/classes"),
	  studentRoutes = require("./routes/students"),
	  indexRoutes   = require("./routes/index")

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());

mongoose.connect("mongodb+srv://vtao:AllonsyAlonso@cluster0-eo3ne.mongodb.net/lastwordpicker?retryWrites=true", {
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() => {
	console.log("Connected to DB");
}).catch(err => {
	console.log("ERROR", err.message);
});
mongoose.set('useFindAndModify', false);

app.use(require("express-session")({
	secret: "you'll be in my heart",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use(indexRoutes);
app.use("/classes", classRoutes);
app.use(studentRoutes);

var port = process.env.PORT || 9000;
app.listen(port, function () {
    console.log("Server has started");
});