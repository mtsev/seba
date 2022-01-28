/***
 * Get username history of any verified server member.
 * Only works for users currently in the server.
 */

// Export command so it can be used
module.exports = {
    name:        'getalias',
    aliases:     ['alias', 'getnames', 'names'],
    description: 'Get all the usernames a member has been known by. ' +
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
    var sendOutput = async function (history) {
        // No history found for target member
        if (history.length === 0) {
            botReply = `Couldn't find \`${target.user.tag}\` ` +
                            "in the database, user hasn't verified";

        // Send formatted history to channel
        } else {
            botReply = `Aliases for ${target.user.tag}:\n`;

            // Add username history to reply
            const unique = [...new Set(history.reverse().map(entry => entry.username))];
            botReply += unique.join('\n');
            botReply = '```' + botReply + '```';
        }
        // Send output message
        await message.channel.send(botReply).catch(console.error);
    };

    // Lookup target member from database
    const { getNames } = require('../database/interface.js');
    await getNames(target.user, sendOutput);
}
