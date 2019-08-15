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

app.get("/", function(req, res){
	res.render("home");
})

app.get("/classes", function(req, res){
	Class.find({}, function(err, allClasses){
		if(err){
			console.log(err);
		} else {
			res.render("classes/index", {classes: allClasses});
		}
})
})

//CREATE

app.get("/classes/new", isLoggedIn, function(req, res){
	res.render("classes/new");
})

app.post("/classes", isLoggedIn, function(req, res){
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newClass = {
		name: req.body.name,
		description: req.body.description,
		image: req.body.image,
		author: author,
	}
	Class.create(newClass, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else {
			req.flash("success", "Class successfully created")
			res.redirect("/classes");
		}
	})
})

//READ
app.get("/classes/:id", function(req, res){
	Class.findById(req.params.id).populate("students").exec(function(err, foundClass){
		if(err){
			console.log(err);
		} else {
			res.render("classes/show", {selectedClass:foundClass});
		}
	})
})

//UPDATE
app.get("/classes/:id/edit", checkClassOwnership, function(req, res){
	Class.findById(req.params.id, function(err, foundClass){
		if(err){
			console.log(err);
		} else {
			res.render("classes/edit", {selectedClass:foundClass});
		}
	})
})

app.put("/classes/:id", checkClassOwnership, function(req, res){
	Class.findByIdAndUpdate(req.params.id, req.body.selectedClass, function(err, updatedClass){
		if(err){
			console.log(err);
		} else {
			res.redirect("/classes/" + req.params.id);
		}
	})
})

//DESTROY
app.delete("/classes/:id", checkClassOwnership, function(req, res){
	Class.findByIdAndRemove(req.params.id, function(err, removedClass){
		if(err){
			console.log(err);
		} else {
			Student.deleteMany({_id: {$in: removedClass.students}}, function(err){
				if(err){
					console.log(err)
				} else {
					req.flash("success", "Class successfully deleted");
					res.redirect("/classes");
				}
			});
		}
	})
})

app.post("/classes/:id", checkClassOwnership, function(req, res){
	Class.findById(req.params.id, function(err, foundClass){
		if(err){
			console.log(err)
		} else {
			var newStudent = {
				name: req.body.name,
			}
			Student.create(newStudent, function(err, newStudent){
				if(err){
					console.log(err);
				} else {
					foundClass.students.push(newStudent);
					foundClass.save();
					res.redirect("/classes/" + req.params.id);
				}
			});
		}
	})
	
})

app.get("/classes/:id/choose", function(req, res){
	Class.findById(req.params.id).populate("students").exec(function(err, foundClass){
		if(err){
			console.log(err);
		} else {
			res.render("classes/choose", {selectedClass:foundClass});
		}
	})
})

app.delete("/classes/:id/students/:student_id", checkClassOwnership, function(req, res){
	Student.findByIdAndRemove(req.params.student_id, function(err, removedStudent){
		if(err){
			console.log(err);
		} else {
			res.redirect("/classes/" + req.params.id)
		}
	})
})

app.get("/register", function(req, res){
	res.render("register");
})

app.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			return res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/classes");
		})
	})
})

app.get("/login", function(req, res){
	res.render("login")
})

app.post("/login", passport.authenticate("local", {
	successRedirect: "/classes",
	failureRedirect: "/login",
}), function(req, res){
	
})

app.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Successfully logged out")
	res.redirect("/classes");
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}

function checkClassOwnership(req, res, next){
	if(req.isAuthenticated()){
		Class.findById(req.params.id, function(err, foundClass){
			if(err){
				req.flash("error", "Class not found")
				res.redirect("back")
			} else {
				if(!foundClass){
					req.flash("error", "Item not found")
					return res.redirect("back")
				}
				if(foundClass.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You do not have permission to do that")
					res.redirect("back")
				}
			}
		})
	}
}

var port = process.env.PORT || 9000;
app.listen(port, function () {
    console.log("Server has started");
});