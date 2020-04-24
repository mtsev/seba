const mysql = require('mysql');
const { host, user, password, database } = require('./dbConfig.json');

var connection = mysql.createConnection({
    host     : host,
    user     : user,
    password : password,
    database : database
});

module.exports = {
    lookup: lookup,
    addVerified: addVerified,
    addUsername: addUsername,
    getNames: getNames,
};

/* Look up member information from database */
async function lookup(user, callback) {
    
    // Connect to database
    connection.connect();

    // Get submission data from table using discord id
    let sqlString = "SELECT real_name, email_address, zid, phone_number " +
                    "FROM submissions INNER JOIN verified_members " +
                    "ON verified_members.submission = submissions.submission_id " +
                    "WHERE discord_id = ?";
    let values = [user.id];

    // Pass answer to callback function
    connection.query(sqlString, values, async (error, results, fields) => {
        
        if (error) throw error;
        console.log(`[${new Date().toLocaleString()}] Looking up ${user.tag}:--`); 
        console.log(results);

        // Pass in first result to callback function, or NULL for no results
        if (results.length === 0) {
            await callback(null);
        } else {
            await callback(results[0]);
        }
    });

    // Close connection to database
    connection.end();
}

/* Add new verified user to database */
function addVerified(user) {

    // Connect to database
    connection.connect();

    // Use most recent submission matching discord name
    let sqlString = "INSERT INTO verified_members (discord_id, submission) VALUES ( ?, " +
                    "(SELECT MAX(submission_id) FROM submissions WHERE LOWER(discord_name) = ?))";
    let values = [user.id, user.tag.toLowerCase()];

    // No callback function for user output, only log to console
    connection.query(sqlString, values, (error, results, fields) => {
        if (error) { 
            if (error.code === 'ER_DUP_ENTRY') {
                console.log(`[${new Date().toLocaleString()}] Existing database entry for ${user.tag}`); 
            } else {
                throw error;
            }
        } else {
            console.log(`[${new Date().toLocaleString()}] Adding new member ${user.tag}:--`); 
            console.log(results);
        }
    });

    // Close connection to database
    connection.end();
}

/* Log verified member's username change to database */
function addUsername(user) {

    // Connect to database
    connection.connect();

    // Add new entry into username history table
    let sqlString = "INSERT INTO username_history (username, discriminator, discord_id) " +
                    "VALUES ( ?, ?, ? )";
    let values = [user.username, user.discriminator, user.id];

    // No callback function for user output, only log to console
    connection.query(sqlString, values, (error, results, fields) => {
        if (error) throw error;
        console.log(`[${new Date().toLocaleString()}] New username change ${user.tag}:--`); 
        console.log(results);
    });

    // Close connection to database
    connection.end();
}

/* Look up username history for member */
async function getNames(user, callback) {

    // Connect to database
    connection.connect();

    // Add new entry into username history table
    let sqlString = "SELECT name_id, modified, username, discriminator " + 
                    "FROM username_history WHERE discord_id = ?";
    let values = [user.id];

    // Pass in results to callback
    connection.query(sqlString, values, (error, results, fields) => {
        if (error) throw error;
        console.log(`[${new Date().toLocaleString()}] Getting username history for ${user.tag}:--`); 
        console.log(results);
        await callback(results);
    });

    // Close connection to database
    connection.end();
}