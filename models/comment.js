var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

//Variable “module” is an object representing the current module. 
//It is local to each module and it is also private (only accessible from module code)
//module.exports allows use current module in other files
module.exports = mongoose.model("Comment", commentSchema);