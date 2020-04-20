const mysql = require('mysql');
const { categories, database } = require('../config.json');

// Export command so it can be used
module.exports = {
    name: 'lookup',
    description: 'Look up member information from database',
    privileged: true,
    execute: execute,
};

// Actual command to execute
async function execute(guild, message, args) {

    // Ignore messages outside of exec category
    if (message.channel.type !== 'text' || message.channel.parentID !== categories.exec) return;

    // Missing argument(s)
    if (args.length === 0) {
        let botReply = '`usage: !lookup <username>`';
        await message.reply(botReply).catch(console.error);
        return;
    }

    // Concatenate all arguments into a single string
    let arg = args.join(' ');

    // Parse argument to get target member
    let target;
    const taggedUser = message.mentions.users.first();

    if (taggedUser) {
        target = guild.member(taggedUser);
    } else if (arg.includes('#')) {
        target = guild.members.find(member => member.user.tag === arg);
    } else {
        target = guild.members.find(member => member.user.username === arg 
                                        || member.nickname === arg);
    }

    // Check that the target member is actually in the server
    if (!target) {
        let botReply = `couldn't find \`${arg}\` in the server`;
        await message.reply(botReply).catch(console.error);
        return;
    }

    // Connect to database
    var connection = mysql.createConnection({
        host     : database.host,
        user     : database.user,
        password : database.password,
        database : database.database
    });

    connection.connect();

    // Look up member data
    let sqlString = 'SELECT real_name, email_address, zid, phone_number ' +
                'FROM submissions INNER JOIN verified_members ' +
                'ON verified_members.submission_id = submissions.submission_id ' +
                'WHERE discord_id = ?';
    let values = [target.user.id];

    connection.query(sqlString, values, async (error, results, fields) => {
        
        if (error) throw error;
        console.log(`[${new Date().toLocaleString()}] Looking up ${target.user.tag}:--`); 
        console.log(results);

        // Send reply to channel
        if (results.length === 0) {
            let botReply = `couldn't find \`${target.user.tag}\` in the database, user hasn't verified`;
            await message.reply(botReply).catch(console.error);

        } else {
            // Formatted string of member information
            let botReply = '```' + `Name:    ${results[0].real_name}\n` + 
                        `Discord: ${target.user.tag}\nEmail:   ${results[0].email_address}`;

            // Add zID if it was in the database
            if (results[0].zid) botReply += `\nzID:     ${results[0].zid}`;

            // Add phone number if it was in the database
            if (results[0].phone_number) botReply += `\nPhone:   ${results[0].phone_number}`;

            // Close formatting
            botReply += '```';

            await message.channel.send(botReply).catch(console.error);
        }
    });

    // Close connection to database
    connection.end();
}
