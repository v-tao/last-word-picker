const express 		= require("express"),
	  router  		= express.Router(),
	  Class   		= require("../models/class"),
	  Student 		= require("../models/student"),
	  middleware    = require("../middleware");

router.get("/", function(req, res){
	Class.find({}, function(err, allClasses){
		if(err){
			console.log(err);
		} else {
			res.render("classes/index", {classes: allClasses});
		}
})
})

//CREATE
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("classes/new");
})

router.post("/", middleware.isLoggedIn, function(req, res){
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
router.get("/:id", function(req, res){
	Class.findById(req.params.id).populate("students").exec(function(err, foundClass){
		if(err){
			console.log(err);
		} else {
			res.render("classes/show", {selectedClass:foundClass});
		}
	})
})

//UPDATE
router.get("/:id/edit", middleware.checkClassOwnership, function(req, res){
	Class.findById(req.params.id, function(err, foundClass){
		if(err){
			console.log(err);
		} else {
			res.render("classes/edit", {selectedClass:foundClass});
		}
	})
})

router.put("/:id", middleware.checkClassOwnership, function(req, res){
	Class.findByIdAndUpdate(req.params.id, req.body.selectedClass, function(err, updatedClass){
		if(err){
			console.log(err);
		} else {
			res.redirect("/classes/" + req.params.id);
		}
	})
})

//DESTROY
router.delete("/:id", middleware.checkClassOwnership, function(req, res){
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

//CHOOSE
router.get("/:id/choose", function(req, res){
	Class.findById(req.params.id).populate("students").exec(function(err, foundClass){
		if(err){
			console.log(err);
		} else {
			res.render("classes/choose", {selectedClass:foundClass});
		}
	})
})

module.exports = router;