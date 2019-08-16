const Class = require("../models/class"),
	  Student = require("../models/student")

middlewareObj = {
	
};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login")
}

middlewareObj.checkClassOwnership = function(req, res, next){
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

module.exports = middlewareObj;