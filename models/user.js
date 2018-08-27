var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//Everything in Mongoose starts with a Schema. 
//Each schema maps to a MongoDB collection and defines the shape of the documents within that collection
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

//Models are constructors compiled from Schema definitions. 
//An instance of a model is called a document. 
//Mongoose documents represent a one-to-one mapping to documents 
//as stored in MongoDB. Each document is an instance of its Model
module.exports = mongoose.model("User", UserSchema);