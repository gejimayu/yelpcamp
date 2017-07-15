var mongoose    = require("mongoose"),
    Campground  = require("./model/campground.js"),
    Comment     = require("./model/comment.js");
    
var data = [
    {
        name: "Granite Hill", 
        image: "https://farm5.staticflickr.com/4027/4368764673_c8345bd602.jpg", 
        desc: "It's beautiful !!!!!! Trust me you won't regret this experience."
    },
    {
        name: "Somewhere Cool", 
        image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg", 
        desc: "It's beautiful !!!!!! Trust me you won't regret this experience."
    },
    {
        name: "Beach", 
        image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg", 
        desc: "It's beautiful !!!!!! Trust me you won't regret this experience."
    }
];    

function seedDB() {
    Campground.remove({}, function(err){
    if (err)
        console.log(err);
    else
        console.log("removed succesfully");
        data.forEach(function(ele){
           Campground.create(ele, function(err, campCreated){
                if (err)
                    console.log(err);
                else
                    console.log("added a campground");
                    Comment.create(
                        {
                            author: "Homer", 
                            text: "fucking stupid"
                        },
                        function(err, commentCreated){
                            if (err)
                                console.log(err)
                            else {
                                campCreated.comments.push(commentCreated);
                                campCreated.save(); 
                            }
                        }
                    )
           }); 
        });
    });
}

module.exports = seedDB;
