/***
 * Fetch a server member's verification details.
 * Only works for members currently in the server.
 */

// Export command so it can be used
module.exports = {
    name:        'getuser',
    aliases:     ['user', 'userinfo', 'info', 'lookup'],
    description: "Get a member's personal information from database. " +
                 'Can only be used in exec channels.',
    usage:      '<discord_name>',
    privileged: true,
    database:   true,
    execute:    execute
};

// Actual command to execute
async function execute(guild, message, args) {
    if (!message.client.database) return;
    let botReply;

    // Missing argument(s)
    if (args.length === 0) {
        botReply = `usage: ${message.client.prefix}${module.exports.name} ` +
                   `${module.exports.usage}`;
        const msg = await message.reply('```' + botReply + '```').catch(console.error);
        await msg.delete({ timeout: 10000 }).catch(console.error);
        return;
    }

    // Concatenate all arguments into a single string
    const arg = args.join(' ').toLowerCase().replace('\n', '');

    // Parse argument to get target member
    let target;
    const taggedUser = message.mentions.users.first();

    if (taggedUser) {
        target = guild.member(taggedUser);
    } else {
        target = guild.members.cache
            .find(member => member.user.tag.toLowerCase().includes(arg));
    }

    // Check if the name entered was a nickname
    if (!target) {
        target = guild.members.cache
            .find(member => member.nickname &&
                member.nickname.toLowerCase().includes(arg));
    }

    // Check that the target member is actually in the server
    if (!target) {
        botReply = `Couldn't find user containing \`${arg}\` in the server`;
        await message.channel.send(botReply).catch(console.error);
        return;
    }

    // Callback function to process query result and output to user
    var sendOutput = async function (info) {
        // No info found for target member
        if (!info) {
            botReply = `Couldn't find \`${target.user.tag}\` ` +
                       "in the database, user hasn't verified";
        }

        // Send formatted info to channel
        else {
            // Formatted string of member information
            botReply = `Name:    ${info.real_name}\nDiscord: ${target.user.tag}`;
            if (target.nickname) {
                botReply += ` (${target.nickname})`;
            }
            botReply += `\nEmail:   ${info.email_address}`;

            // Add zID if it was in the database
            if (info.zid) {
                botReply += `\nzID:     ${info.zid}`;
            }
            // Add phone number if it was in the database
            if (info.phone_number) {
                botReply += `\nPhone:   ${info.phone_number}`;
            }

            botReply = '```' + botReply + '```';
        }
        // Send output message
        await message.channel.send(botReply).catch(console.error);
    };

    // Lookup target member from database
    const { lookup } = require('../database/interface.js');
    await lookup(target.user, sendOutput);
}
