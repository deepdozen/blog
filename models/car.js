var mongoose = require("mongoose");

var carSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
//Variable “module” is an object representing the current module. 
//It is local to each module and it is also private (only accessible from module code)
module.exports = mongoose.model("car", carSchema);