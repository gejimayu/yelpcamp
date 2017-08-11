var mongoose    = require("mongoose"),
    Post  = require("./model/post.js"),
    Comment     = require("./model/comment.js");
    
// var data = [
//     {
//         name: "Granite Hill", 
//         image: "https://farm5.staticflickr.com/4027/4368764673_c8345bd602.jpg", 
//         desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum."
//     },
//     {
//         name: "Somewhere Cool", 
//         image: "https://farm8.staticflickr.com/7252/7626464792_3e68c2a6a5.jpg", 
//         desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum."
//     },
//     {
//         name: "Beach", 
//         image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg", 
//         desc: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodoconsequat. Duis aute irure dolor in reprehenderit in voluptate velit essecillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat nonproident, sunt in culpa qui officia deserunt mollit anim id est laborum."
//     }
// ];    

function seedDB() {
    // Campground.remove({}, function(err){
    //     if (err)
    //         console.log(err);
    //     else {
    //         console.log("removed succesfully");
    //         data.forEach(function(ele){
    //           Campground.create(ele, function(err, campCreated){
    //                 if (err)
    //                     console.log(err);
    //                 else {
    //                     console.log("added a campground");
    //                     Comment.create(
    //                         {
    //                             author: "Homer", 
    //                             text: "fucking stupid"
    //                         },
    //                         function(err, commentCreated){
    //                             if (err)
    //                                 console.log(err)
    //                             else {
    //                                 console.log("created a comment");
    //                                 campCreated.comments.push(commentCreated);
    //                                 campCreated.save(); 
    //                             }
    //                         }
    //                     )
    //                 }
    //           }); 
    //         });
    //     }
    // });
}

module.exports = seedDB;
