var mongoose = require("mongoose")
var classSchema = new mongoose.Schema({
	name: String,
	description: String,
	image: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	students: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Student"
	}]
})

module.exports = mongoose.model("Class", classSchema);