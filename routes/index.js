const express  = require("express"),
	  passport = require("passport"),
	  User     = require("../models/user"),
	  router   = express.Router();

//HOME
router.get("/", function(req, res){
	res.render("home");
})

//SIGN UP
router.get("/register", function(req, res){
	res.render("register");
})

router.post("/register", function(req, res){
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

//LOGIN
router.get("/login", function(req, res){
	res.render("login")
})

router.post("/login", passport.authenticate("local", {
	successRedirect: "/classes",
	failureRedirect: "/login",
}), function(req, res){
	
})

//LOGOUT
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Successfully logged out")
	res.redirect("/classes");
})

module.exports = router;