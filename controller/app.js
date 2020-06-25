console.log("------------------------------");
console.log("S01 > controller > app.js");
console.log("------------------------------");

//-----------------------------------------------------------------------
// Load Modules
//-----------------------------------------------------------------------
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const user = require('../model/user.js');
const multer = require('multer');

//-----------------------------------------------------------------------
// Standard Functions
//-----------------------------------------------------------------------
function printDebugInfo(urlPattern, req){
    console.log("--------------------------------------");
    console.log(`Servicing ${urlPattern} ..`);
    console.log("Servicing " + req.url + " ...");
    
    console.log("> req.params:" + JSON.stringify(req.params));
    console.log("> req.body:" + JSON.stringify(req.body));

}

//-----------------------------------------------------------------------
// middleware functions (Express only)
//-----------------------------------------------------------------------
var urlencodedParser = bodyParser.urlencoded({extended : false});
var jsonParser = bodyParser.json();

var storage = multer.diskStorage({
   destination: function(req, file, callback){
      callback(null, './images')
   },
   filename: function(req, file, callback){
      callback(null, Date.now() + file.originalname)
   }
})

var fileFilter = (req, file, callback) => {
   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg'){
      callback(null, true)
   }
   else{
      callback(null, false);
      return callback(new Error("Only JPEG is allowed!"))
   }
}

const upload = multer({
   storage: storage, 
   limits:{fileSize: 1024 * 1024 * 1},
   fileFilter: fileFilter
});

//-----------------------------------------------------------------------
// MF Configuration
//-----------------------------------------------------------------------
app.use(urlencodedParser);
app.use(jsonParser);

//-----------------------------------------------------------------------
// end points
//-----------------------------------------------------------------------
// user.getAllUsers#
// http://localhost:8081/users
app.get('/users', function(req, res){
    printDebugInfo("/users", req);
 
    user.findAllUsers(function (err, result){
        if(!err){
            res.status(200).send(result);
        } 
        else{
            res.status(500).send("Unknown error");
        }
    });
 });

 // #User.addUser#
// http://localhost:8081/users
app.post('/users', function(req, res){
    printDebugInfo("/users", req);
 
    var myUser = {
       username: req.body.myUsername,
       email: req.body.myEmail,
       profile_pic_url: req.body.myPPU
    }
 
    user.insertUser(myUser, function (err, result){
        if(!err){
           if(result=="UserTaken"){
            res.status(422).send("Username is already taken!")             
           }
           else{
            var output = {
               "User ID" : result.insertId
            };
            res.status(201).send(output);
           }
        } 
        else{
            res.status(500).send("Unknown error");
        }
    });
 });

 // #User.getUser#
// http://localhost:8081/users/:userID
app.get('/users/:userid', function(req, res){
    printDebugInfo("/users/:userid", req);
 
    var id = req.params.userid;
 
    user.findUserByID(id, function (err, result){
        if(!err){
           if(result){
             res.status(200).send(result);
           }
           else{
             res.status(404).send("User not found");
           }
        } 
        else{
            res.status(500).send("Unknown error");
        }
    });
 });

// #User.updateUser#
// http://localhost:8081/users/:userID
app.put('/users/:userID', function(req, res){
    printDebugInfo("/users/userID", req);
 
    var myUser = {
       username: req.body.myUsername,
       email: req.body.myEmail,
       profile_pic_url: req.body.myPPU
    }
 
    var userID = req.params.userID;
 
    user.editUser(userID, myUser, function (err, result){
       if(!err){
          var output = {
             "Affected Rows" : result.affectedRows
          };
          if(result){
             if(result=="UserTaken"){
                res.status(422).send("Username is already taken!")
             }
             else{
                res.status(204).send("")
             }
          }
          else{
             res.status(404).send("User ID can't be found.")
          }
       } 
       else{
           res.status(500).send("Unknown error");
       }
   });
 });

// user.getAllListings#
// http://localhost:8081/travel
app.get('/travel', function(req, res){
   printDebugInfo("/travel", req);

   user.findAllListings(function (err, result){
       if(!err){
           res.status(200).send(result);
       } 
       else{
           res.status(500).send("Unknown error");
       }
   });
}); 

 // #User.addListing#
// http://localhost:8081/travel
app.post('/travel', function(req, res){
   printDebugInfo("/travel", req);

   var newListing = {
      title: req.body.title,
      desc: req.body.desc,
      price: req.body.price,
      country: req.body.country,
      travelPeriod: req.body.travelPeriod
   }

   user.insertListing(newListing, function (err, result){
       if(!err){
          var output = {
             "travelid" : result.insertId
          };

          res.status(201).send(output);
       } 
       else{
           res.status(500).send("Unknown error");
       }
   });
});

// #User.deleteListing#
// http://localhost:8081/travel/:travelID
app.delete('/travel/:travelid', function(req, res){
   printDebugInfo("/travel/:travelid", req);

   var i_travelid = req.params.travelid;

   user.deleteListing(i_travelid, function (err, result){
      output = ''
      if(!err){
         res.status(204).send(output)
      } 
      else{
         res.status(500).send("Unknown error");
      }
   });
});

// #User.updateListing#
// http://localhost:8081/travel/:travelID
app.put('/travel/:travelid', function(req, res){
   printDebugInfo("/travel/:travelid", req);

   var newListing = {
      title: req.body.title,
      desc: req.body.description,
      price: req.body.price,
      country: req.body.country,
      travelPeriod: req.body.travelPeriod
   }
   var travelID = req.params.travelid;

   user.editListing(travelID, newListing, function (err, result){
      if(!err){
         var output = {
            "Affected Rows" : result.affectedRows
         };

         if(result){
            res.status(204).send(output)
         }
         else{
            res.status(404).send("Travel listing can't be found.")
         }
         
      } 
      else{
          res.status(500).send("Unknown error");
      }
  });
});

 // #User.getItinerary#
// http://localhost:8081/itinerary/:id/
app.get('/travel/:id/itinerary', function(req, res){
   printDebugInfo("/travel/:id/itinerary", req);

   var id = req.params.id;

   user.findItineraryByID(id, function (err, result){
       if(!err){
          if(result){
            res.status(200).send(result);
          }
          else{
            res.status(404).send("Itinerary not found");
          }
       } 
       else{
           res.status(500).send("Unknown error");
       }
   });
});

 // #User.addItinerary#
// http://localhost:8081/travel/:id/itinerary
app.post('/travel/:id/itinerary', function(req, res){
   printDebugInfo("/travel/:id/itinerary", req);

   var newItinerary = {
      day: req.body.day,
      activity: req.body.activity
   }

   var itineraryID = req.params.id

   user.insertItinerary(itineraryID, newItinerary, function (err, result){
       if(!err){
          var output = {
             "itineraryid" : result.insertId
          };

          res.status(201).send(output);
       } 
       else{
           res.status(500).send("Unknown error");
       }
   });
});

 // #User.addReview#
// http://localhost:8081/user/:uid/travel/:tid/review/
app.post('/user/:uid/travel/:tid/review/', function(req, res){
   printDebugInfo("/user/:uid/travel/:tid/review/", req);

   var newReview = {
      content: req.body.content,
      rating: req.body.rating
   }

   var userID = req.params.uid
   var travelID = req.params.tid

   user.insertReview(userID, travelID, newReview, function (err, result){
       if(!err){
          var output = {
             "reviewid" : result.insertId
          };

          res.status(201).send(output);
       } 
       else{
           res.status(500).send("Unknown error");
       }
   });
});

 // #User.getReview#
// http://localhost:8081/travel/:id/review
app.get('/travel/:id/review', function(req, res){
   printDebugInfo("/travel/:id/review", req);

   var id = req.params.id;

   user.findReviewByID(id, function (err, result){
       if(!err){
          if(result){
            res.status(200).send(result);
          }
          else{
            res.status(404).send("Review not found");
          }
       } 
       else{
           res.status(500).send("Unknown error");
       }
   });
});

 // #User.getPromo#
// http://localhost:8081/travel/:id/promo
app.get('/travel/:id/promo', function(req, res){
   printDebugInfo("/travel/:id/promo", req);

   var id = req.params.id;

   user.findPromoByID(id, function (err, result){
       if(!err){
          if(result){
            res.status(200).send(result);
          }
          else{
            res.status(404).send("Promo not found");
          }
       } 
       else{
           res.status(500).send("Unknown error");
       }
   });
});

 // #User.addPromo#
// http://localhost:8081/travel/:id/promo
app.post('/travel/:id/promo', function(req, res){
   printDebugInfo("/travel/:id/promo", req);

   var newPromo = {
      discount: req.body.discount,
      period: req.body.period
   }

   var travelID = req.params.id

   user.insertPromo(travelID, newPromo, function (err, result){
       if(!err){
          var output = {
             "promoid" : result.insertId
          };

          res.status(201).send(output);
       } 
       else{
           res.status(500).send("Unknown error");
       }
   });
});

// #User.deletePromo#
// http://localhost:8081/travel/:id/promo
app.delete('/travel/:id/promo', function(req, res){
   printDebugInfo("/travel/:id/promo", req);

   var promoid = req.params.id;

   user.deletePromo(promoid, function (err, result){
      if(!err){
         res.status(204).send("")
      } 
      else{
         res.status(500).send("Unknown error");
      }
   });
});

// #User.uploadIMG#
// http://localhost:8081/travel/:id/promo/upload
app.post("/travel/:id/upload/promo", upload.single("travelIMG"), (req, res) => {
   printDebugInfo("/travel/:id/upload/promo", req);

   const file = req.file;
   var travelid = req.params.id
   if(file){
      var path = req.file.path
      user.insertImage(travelid, file, path, function(err, result){
         if(!err && result != null){
            res.status(200).send("Success")
         }
         else{
            if(result == null){
               res.status(404).send("Travel ID can't be found")
            }
            else{
               res.status(500).send(result)
            }
         } 
   
      })
   }
   else{
      res.status(400).send("File upload failed")
   }
   


})

//-----------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------
module.exports = app;
