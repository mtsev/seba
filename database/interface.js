const mysql = require('mysql');
const db = require('./dbConfig.json');

module.exports = {
    closeDatabase: close,
    lookup:        lookup,
    isVerified:    isVerified,
    addVerified:   addVerified,
    addUsername:   addUsername,
    getNames:      getNames
};

/* Use connection pool */
var pool = mysql.createPool({
    host:     db.host,
    port:     db.port,
    user:     db.user,
    password: db.password,
    database: db.database,
    charset:  'utf8mb4'
});

/* Close connection to database */
function close(callback) {
    pool.end((err) => {
        if (err) throw err;
        console.log('MySQL connection closed');
        callback();
    });
}

/* Look up member information from database */
async function lookup(user, callback) {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        // Get submission data from table using discord id
        const sqlString = 'SELECT real_name, email_address, zid, phone_number' +
                        ' FROM submissions s INNER JOIN verified_members vm' +
                        ' ON vm.submission = s.submission_id' +
                        ' WHERE discord_id = ?';
        const values = [user.id];

        // Pass answer to callback function
        connection.query(sqlString, values, async (error, results, fields) => {
            connection.release();

            if (error) throw error;
            console.log(`Getting info for ${user.tag}: ` +
                        `${results.length} rows returned`);

            // Should get one result if member is verified. Pass in NULL if no results
            if (results.length === 0) {
                await callback(null);
            } else {
                await callback(results[0]);
            }
        });
    });
}

/* Check if user is already verified */
async function isVerified(user, callback) {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        // Use most recent submission matching discord name
        const sqlString = 'SELECT EXISTS (SELECT 1 FROM verified_members' +
                        ' WHERE discord_id = ?)';
        const values = [user.id];

        // Result should return single row with value 0 or 1
        connection.query(sqlString, values, async (error, results, fields) => {
            connection.release();

            if (error) throw error;
            console.log(`Checking if ${user.tag} is verified: ` +
                        `${results.length} rows returned`);

            // Pass in value from EXISTS query
            await callback(Object.values(results[0])[0]);
        });
    });
}

/* Add new verified user to database */
async function addVerified(user) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) throw err;

            // Use most recent submission matching discord name
            const sqlString = 'INSERT INTO verified_members (discord_id, submission)' +
                            ' VALUES ( ?, (SELECT MAX(submission_id)' +
                            ' FROM submissions WHERE LOWER(discord_name) = ?))';
            const values = [user.id, user.tag.toLowerCase()];

            // No callback function for user output, only log to console
            connection.query(sqlString, values, (error, results, fields) => {
                connection.release();

                if (!error) {
                    console.log(`Adding verified member ${user.tag}: ` +
                        `${results.affectedRows} rows affected`);
                    resolve();
                } else if (error.code === 'ER_DUP_ENTRY') {
                    // This error shouldn't happen since verified role is persistent
                    // But we'll catch it since it doesn't affect behaviour
                    console.error(`Existing entry for verified member ${user.tag}`);
                    resolve();
                } else {
                    reject(error);
                }
            });
        });
    });
}

/* Log verified member's username change to database */
async function addUsername(user) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) throw err;

            // Add new entry into username history table
            const sqlString = 'INSERT INTO username_history' +
                            ' (username, discriminator, discord_id) VALUES ( ?, ?, ? )';
            const values = [user.username, user.discriminator, user.id];

            // No callback function for user output, only log to console

            connection.query(sqlString, values, (error, results, fields) => {
                connection.release();

                if (error) {
                    reject(error);
                } else {
                    console.log(`Adding username ${user.tag}: ` +
                        `${results.affectedRows} rows affected`);
                    resolve();
                }
            });
        });
    });
}

/* Look up username history for member */
async function getNames(user, callback) {
    pool.getConnection((err, connection) => {
        if (err) throw err;

        // Add new entry into username history table
        const sqlString = 'SELECT name_id, modified, username, discriminator' +
                        ' FROM username_history WHERE discord_id = ?';
        const values = [user.id];

        // Pass in results to callback
        connection.query(sqlString, values, async (error, results, fields) => {
            connection.release();

            if (error) throw error;
            console.log(`Getting username history for ${user.tag}: ` +
                        `${results.length} rows returned`);
            await callback(results);
        });
    });
}
