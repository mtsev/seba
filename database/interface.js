module.exports = {
    lookup: lookup,
    addVerified: addVerified,
    addUsername: addUsername,
    getNames: getNames,
};

/* Look up member information from database */
async function lookup(user, callback) {

    // Get global connection object from client
    const connection = user.client.database;

    // Get submission data from table using discord id
    let sqlString = "SELECT real_name, email_address, zid, phone_number " +
                    "FROM submissions INNER JOIN verified_members " +
                    "ON verified_members.submission = submissions.submission_id " +
                    "WHERE discord_id = ?";
    let values = [user.id];

    // Pass answer to callback function
    connection.query(sqlString, values, async (error, results, fields) => {
        
        if (error) throw error;
        console.log(`Getting info for ${user.tag}: ${results.length} rows returned`); 

        // Pass in first result to callback function, or NULL for no results
        if (results.length === 0) {
            await callback(null);
        } else {
            await callback(results[0]);
        }
    });
}

/* Add new verified user to database */
function addVerified(user) {

    // Get global connection object from client
    const connection = user.client.database;

    // Use most recent submission matching discord name
    let sqlString = "INSERT INTO verified_members (discord_id, submission) VALUES ( ?, " +
                    "(SELECT MAX(submission_id) FROM submissions WHERE LOWER(discord_name) = ?))";
    let values = [user.id, user.tag.toLowerCase()];

    // No callback function for user output, only log to console
    connection.query(sqlString, values, (error, results, fields) => {
        if (error) { 
            if (error.code === 'ER_DUP_ENTRY') {
                console.log(`Existing entry for verified member ${user.tag}`); 
            } else {
                throw error;
            }
        } else {
            console.log(`Adding verified member ${user.tag}: ${results.affectedRows} rows affected`); 
        }
    });
}

/* Log verified member's username change to database */
function addUsername(user) {

    // Get global connection object from client
    const connection = user.client.database;

    // Add new entry into username history table
    let sqlString = "INSERT INTO username_history (username, discriminator, discord_id) " +
                    "VALUES ( ?, ?, ? )";
    let values = [user.username, user.discriminator, user.id];

    // No callback function for user output, only log to console
    connection.query(sqlString, values, (error, results, fields) => {
        if (error) throw error;
        console.log(`Adding username ${user.tag}: ${results.affectedRows} rows affected`);
    });
}

/* Look up username history for member */
function getNames(user, callback) {

    // Get global connection object from client
    const connection = user.client.database;

    // Add new entry into username history table
    let sqlString = "SELECT name_id, modified, username, discriminator " + 
                    "FROM username_history WHERE discord_id = ?";
    let values = [user.id];

    // Pass in results to callback
    connection.query(sqlString, values, async (error, results, fields) => {
        if (error) throw error;
        console.log(`Getting username history for ${user.tag}: ${results.length} rows returned`);
    });
}
