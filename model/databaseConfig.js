console.log("------------------------------");
console.log("S01 > model > databaseConfig.js");
console.log("------------------------------");

//-----------------------------------------------------------------------
// load modules
//-----------------------------------------------------------------------
var mysql = require('mysql');

// attempt to get a connection to the DB
var conn = mysql.createConnection({
    host: "localhost",
    //port: "/Application/MAMP/tmp/mysql/mysql.sock",
    user: "root",
    password: "ihatethis@123",
    database: "travel",
    multipleStatements: true
});


conn.connect(function (err) {
    if (err) {
        console.log("Error connecting to database: " + err.stack);
    }
    else{
        console.log("Database connected")
    }
});

//-----------------------------------------------------------------------
// Export
//-----------------------------------------------------------------------
module.exports = conn;
