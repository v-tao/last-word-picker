var mongoose = require("mongoose");
var studentSchema = new mongoose.Schema({
	name: String,
})

module.exports = mongoose.model("Student", studentSchema )