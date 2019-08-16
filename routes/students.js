const express = require("express"),
	  router  = express.Router(),
	  Class   = require("../models/class"),
	  Student = require("../models/student"),
	  middleware = require("../middleware");

//CREATE
router.post("/classes/:id", middleware.checkClassOwnership, function(req, res){
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

//DESTROY
router.delete("/classes/:id/students/:student_id", middleware.checkClassOwnership, function(req, res){
	Student.findByIdAndRemove(req.params.student_id, function(err, removedStudent){
		if(err){
			console.log(err);
		} else {
			res.redirect("/classes/" + req.params.id)
		}
	})
})

module.exports = router;