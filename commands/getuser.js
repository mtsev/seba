const { categories } = require('../config.json');

// Export command so it can be used
module.exports = {
    name: 'getuser',
    description: "Get a member's personal information from database. " +
                 "Can only be used in exec channels.",
    usage: '<discord_name>',
    privileged: true,
    execute: execute,
};

// Actual command to execute
async function execute(guild, message, args) {

    // Optional database command, check if enabled in client
    if (!message.client.database) return;

    // Ignore messages outside of exec category
    if (message.channel.type !== 'text' || message.channel.parentID !== categories.exec) return;

    // Missing argument(s)
    if (args.length === 0) {
        let botReply = `\`usage: ${message.client.prefix}${module.exports.name} ${module.exports.usage}\``;
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

    // Callback function to process query result and output to user
    var sendOutput = async function (info) {

        // No info found for target member
        if (!info) {
            let botReply = `couldn't find \`${target.user.tag}\` in the database, user hasn't verified`;
            await message.reply(botReply).catch(console.error);
    
        // Send formatted info to channel
        } else {
            // Formatted string of member information
            let botReply = '```' + `Name:    ${info.real_name}\n` + 
                        `Discord: ${target.user.tag}\nEmail:   ${info.email_address}`;
    
            // Add zID if it was in the database
            if (info.zid) botReply += `\nzID:     ${info.zid}`;
    
            // Add phone number if it was in the database
            if (info.phone_number) botReply += `\nPhone:   ${info.phone_number}`;
    
            // Close formatting
            botReply += '```';
    
            await message.channel.send(botReply).catch(console.error);
        }
    }

    // Lookup target member from database
    const { lookup } = require('../database/interface.js');
    await lookup(target.user, sendOutput);
}
