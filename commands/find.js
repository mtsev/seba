const mysql = require('mysql');
const { categories, database } = require('../config.json');

// Export command so it can be used
module.exports = {
    name: 'find',
    description: 'Find a member using a part of their name and return information from database',
    privileged: true,
    execute: execute,
};

// Actual command to execute
async function execute(guild, message, args) {

    // Ignore messages outside of exec category
    if (message.channel.type !== 'text' || message.channel.parentID !== categories.exec) return;

    // Only accept one argument
    if (args.length !== 1) {
        let botReply = '`usage: !find <part_of_name>`';
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
    let sqlString = 'SELECT real_name, email_address, zid, phone_number, discord_id, discord_name ' +
        'FROM submissions INNER JOIN verified_members ' +
        'ON verified_members.submission_id = submissions.submission_id ' +
        'WHERE locate(?, LOWER(real_name)) > 0';
    let values = [`'${args[0].toLowerCase()}'`];

    connection.query(sqlString, values, async (error, results, fields) => {
        
        if (error) throw error;
        console.log(`[${new Date().toLocaleString()}] Finding members matching '${args[0]}':--`); 
        console.log(results);

        // Couldn't find any results
        if (results.length === 0) {
            let botReply = `couldn't find members matching \`${args[0]}\` in the database`;
            await message.reply(botReply).catch(console.error);

        } else {
            let replyArr = [];

            // Sort in alphabetical order of member's name
            results.sort((a, b) => a.real_name.localeCompare(b.real_name)).forEach(r => {
                let member = guild.member(r.discord_id);

                // Check if the member is still in the server
                if (!member) {
                    replyArr.push(`${r.real_name} (${r.discord_name}) isn't in server anymore`);
                } else {
                    // Formatted string of member information
                    let str = `Name:    ${r.real_name}\nDiscord: ${member.user.tag}\nEmail:   ${r.email_address}`;

                    // Add zID if it was in the database
                    if (r.zid) str += `\nzID:     ${r.zid}`;

                    // Add phone number if it was in the database
                    if (r.phone_number) str += `\nPhone:   ${r.phone_number}`;

                    // Store formatted output string to array
                    replyArr.push(str);
                }
            });

            // Separate each member with hyphens
            let botReply = '```\n' + replyArr.join('\n-----------------------------------\n') + '```';

            // Discord message has 2000 character limit
            await message.channel.send(botReply).catch(async error => {
                if (error.code === 50035) {
                    await message.reply('your query was too big for Discord!');
                } else {
                    console.log(error);
                }
            });
        }
    });

    // Close connection to database
    connection.end();
}
