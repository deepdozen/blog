var mongoose = require("mongoose");
var Car = require("./models/car");
var Comment = require("./models/comment");

var data = [
    {
        name: "bmw-m3-cs-2018",
        image: "https://wallpaper4rest.com/cars/wallpaper/bmw-m3-cs-2018-free-wallpaper_1-800x600.jpg",
        description: "This is a BMW M3 2018"
    },
    {
        name: "bmw-m3-concept2-2007",
        image: "https://wallpaper4rest.com/cars/wallpaper/bmw-m3-concept-2-2007-best-wallpaper_1-800x600.jpeg",
        description: "BMW M3 concept 2007"
    },
    {
        name: "bmw-m3-cars",
        image: "https://wallpaper4rest.com/cars/wallpaper/bmw-m3-cars-cute-wallpaper_1-800x600.jpg",
        description: "BMW M3"
    }
]

function seedDB() {
    //Remove all records
    Car.remove({}, err => {
        if(err){
            console.log(err);
        }
        console.log("removed records!");
        data.forEach(seed=>{
            Car.create(seed,(err,car)=>{
                if(err){
                    console.log(err)
                } else {
                    console.log("added a record");
                    Comment.create({
                        text: "Nice car!!",
                        author: "John Doe"
                    },(err,comment)=>{
                        if(err){
                            console.log(err);
                        }else{
                            car.comments.push(comment);
                            car.save();
                            console.log("Created new comment");
                        }
                    });
                }
            })
        })
    });
}

module.exports = seedDB;