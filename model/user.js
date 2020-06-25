console.log("------------------------------");
console.log("S01 > model > user.js");
console.log("------------------------------");

//-----------------------------------------------------------------------
// load modules
//-----------------------------------------------------------------------
var db = require('./databaseConfig.js');

//-----------------------------------------------------------------------
// functions
//-----------------------------------------------------------------------
var userDB = {
    findAllUsers: function (callback) {
        console.log("userDB.findAllUsers() ...")

        var sql = 'SELECT userid, username, profile_pic_url, created_at FROM user'

        db.query(sql, [], function (err, result) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                return callback(null, result);
            }
        });
    },
    insertUser: function (user, callback) {
        console.log("userDB.insertUser() ...")
        
        var checkExist = "SELECT * FROM user WHERE username=?"
        db.query(checkExist, [user.username], function(err, result){
            if(err){
                console.log(err);
                return callback(err, null);
            }
            else{
                console.log(result.length)
                if(result.length != 0){
                    result = "UserTaken";
                    console.log("Username taken");
                    return callback(null, result);
                }
                else{
                    var sql = 'INSERT INTO user (username, email, profile_pic_url) VALUES (?, ?, ?)';
        
                    db.query(sql, [user.username, user.email, user.profile_pic_url], function (err, result) {
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        } 
                        else {
                            console.log(JSON.stringify(result));
                            console.log(result.affectedRows);
                            return callback(null, result);
                        }
                      });
                }
            }
        })
    

    },
    findUserByID: function (id, callback) {
        console.log("userDB.findUserByID() ...")

        var sql = 'SELECT * FROM user WHERE userid = ?'

        db.query(sql, [id], function (err, result) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } 
            else {
                if(result.length == 0){
                    return callback(null, null)
                }
                else{
                    return callback(null, result[0]);
                }
                
            }
        });
    },
    editUser: function (userID, user, callback) {
        console.log("userDB.editUser() ...");

        var checkExist = "SELECT * FROM user WHERE username=?"
        db.query(checkExist, [user.username], function(err, result){
            if(err){
                console.log(err);
                return callback(err, null);
            }
            else{
                console.log(result.length)
                if(result.length != 0){
                    result = "UserTaken";
                    console.log("Username taken");
                    return callback(null, result);
                }
                else{
                    var sql = 'UPDATE user SET username=?, email=?, profile_pic_url=? WHERE userid=?';
        
                    db.query(sql, [user.username, user.email, user.profile_pic_url, userID], function (err, result) {
                        if (err) {
                            console.log(err);
                            return callback(err, null);
                        } 
                        else {
                            console.log(result.affectedRows);
                
                            if(result.affectedRows == 0){
                              return callback(null, null);
                            }
                            else{
                              return callback(null, result.affectedRows);
                            }
                            
                        }
                    });
                }
            }
        })
    

    },
    findAllListings: function (callback) {
        console.log("userDB.findAllListings() ...")

        var sql = 'SELECT travelid, title, description, price, country, DATE_FORMAT(TravelPeriod, "%b %Y") AS TravelPeriod, travelIMG FROM travel;'

        db.query(sql, [], function (err, result) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else {
                return callback(null, result);
            }
        });
    },
    insertListing: function (newListing, callback) {
        console.log("userDB.insertListing() ...")
    
        var sql = 'INSERT INTO travel (title, description, price, country, TravelPeriod) VALUES (?, ?, ?, ?, ?)';
        
        db.query(sql, [newListing.title, newListing.desc, newListing.price, newListing.country, newListing.travelPeriod], function (err, result) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } 
            else {
                console.log(JSON.stringify(result));
                console.log(result.affectedRows);
                return callback(null, result);
            }
          });
    },
    deleteListing: function (travelID, callback) {
        console.log("userDB.deleteListing() ...")
    
        var sql = 'DELETE FROM travel WHERE travelid=?';
        
        db.query(sql, [travelID], function (err, result){            
            if (err) {
                console.log(err);
                return callback(err, null);
            } 
            else {
                console.log(result.affectedRows);
                return callback(null, result.affectedRows);
            }
        });
    },
    editListing: function (travelID, newListing, callback) {
        console.log("userDB.editListing() ...");
    
        var sql = 'UPDATE travel SET title=?, description=?, price=?, country=?, TravelPeriod=? WHERE travelid=?';
        
        db.query(sql, [newListing.title, newListing.desc, newListing.price, newListing.country, newListing.travelPeriod, travelID], function (err, result) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } 
            else {
                console.log(result.affectedRows);
    
                if(result.affectedRows == 0){
                  return callback(null, null);
                }
                else{
                  return callback(null, result.affectedRows);
                }
                
            }
        });
    },
    findItineraryByID: function (id, callback) {
        console.log("userDB.findItineraryByID() ...")

        var sql = 'SELECT itineraryid, day, activity, created_at FROM itinaries WHERE itineraryid = ?'

        db.query(sql, [id], function (err, result) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } 
            else {
                if(result.length == 0){
                    return callback(null, null)
                }
                else{
                    return callback(null, result);
                }
                
            }
        });
    },
    insertItinerary: function (itineraryID, newItinerary, callback) {
        console.log("userDB.insertItinerary() ...")
    
        var sql = 'INSERT INTO itinaries (itineraryid, day, activity) VALUES (?, ?, ?)';
        
        db.query(sql, [itineraryID, newItinerary.day, newItinerary.activity], function (err, result) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } 
            else {
                console.log(JSON.stringify(result));
                console.log(result.affectedRows);
                return callback(null, result);
            }
          });
    },
    insertReview: function (userID, travelID, newReview, callback) {
        console.log("userDB.insertReview() ...")
    
        var sql = 'INSERT INTO review (userid, travelid, content, rating) VALUES (?, ?, ?, ?)';
        
        db.query(sql, [userID, travelID, newReview.content, newReview.rating], function (err, result) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } 
            else {
                console.log(JSON.stringify(result));
                console.log(result.affectedRows);
                return callback(null, result);
            }
          });
    },
    findReviewByID: function (travelid, callback) {
        console.log("userDB.findReviewByID() ...")

        var sql = `
        SELECT
            g.travelid, f.content, f.rating, u.username, f.created_at
        FROM 
            review as f,
            user as u,
            travel as g 
        WHERE
            g.travelid = f.travelid AND 
            g.travelid = ?`

        db.query(sql, [travelid], function (err, result) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } 
            else {
                if(result.length == 0){
                    return callback(null, null)
                }
                else{
                    return callback(null, result.slice(0,(result.length/3)-1));
                }
                
            }
        });
    },
    findPromoByID: function (travelid, callback) {
        console.log("userDB.findPromoByID() ...")

        var sql = `
        SELECT
            *
        FROM 
            promo 
        WHERE 
            travelid = ?`

        db.query(sql, [travelid], function (err, result) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } 
            else {
                if(result.length == 0){
                    return callback(null, null)
                }
                else{
                    return callback(null, result[0]);
                }
                
            }
        });
    },
    insertPromo: function (travelID, newPromo, callback) {
        console.log("userDB.insertPromo() ...")
    
        var sql = 'INSERT INTO promo (travelid, discount, period) VALUES (?, ?, ?)';
        
        db.query(sql, [travelID, newPromo.discount, newPromo.period], function (err, result) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } 
            else {
                console.log(JSON.stringify(result));
                console.log(result.affectedRows);
                return callback(null, result);
            }
          });
    },
    deletePromo: function (promoID, callback) {
        console.log("userDB.deletePromo() ...")
    
        var sql = 'DELETE FROM promo WHERE promoid=?';
        
        db.query(sql, [promoID], function (err, result){            
            if (err) {
                console.log(err);
                return callback(err, null);
            } 
            else {
                console.log(result.affectedRows);
                return callback(null, result.affectedRows);
            }
        });
    },
    insertImage: function(travelID, IMG, path, callback){
        const image = IMG
        var sql = "UPDATE travel SET travelIMG=? WHERE travelid=?"

        db.query(sql, [path, travelID],function(err, result){
            if(err){
                console.log(err);
                return callback(err, null)
            }
            else{
                console.log(result.affectedRows)
                if(result.affectedRows == 0){
                    return callback(null, null)
                }
                else{
                    return callback(null, result.affectedRows)
                }
            }
        })
    },
}

//-----------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------
module.exports = userDB
