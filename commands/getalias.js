const { categories } = require('../config.json');

// Export command so it can be used
module.exports = {
    name:        'getalias',
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

    // Ignore messages outside of exec category
    if (message.channel.type !== 'text' ||
        message.channel.parentID !== categories.exec) return;

    // Missing argument(s)
    if (args.length === 0) {
        const botReply = `\`usage: ${message.client.prefix}${module.exports.name} ` +
                        `${module.exports.usage}\``;
        await message.reply(botReply).catch(console.error);
        return;
    }

    // Concatenate all arguments into a single string
    const arg = args.join(' ');

    // Parse argument to get target member
    let target;
    const taggedUser = message.mentions.users.first();

    if (taggedUser) {
        target = guild.member(taggedUser);
    } else if (arg.includes('#')) {
        target = guild.members.cache
            .find(member => member.user.tag === arg);
    } else {
        target = guild.members.cache
            .find(member => member.user.username === arg ||
                            member.nickname === arg);
    }

    // Check that the target member is actually in the server
    if (!target) {
        const botReply = `couldn't find \`${arg}\` in the server`;
        await message.reply(botReply).catch(console.error);
        return;
    }

    // Callback function to process query result and output to user
    var sendOutput = async function (history) {
        // No history found for target member
        if (history.length === 0) {
            const botReply = `couldn't find \`${target.user.tag}\` ` +
                            "in the database, user hasn't verified";
            await message.reply(botReply).catch(console.error);

        // Send formatted history to channel
        } else {
            let botReply = `Aliases for ${target.user.username}:\n`;

            // Add username history to reply
            const unique = [...new Set(history.reverse().map(entry => entry.username))];
            botReply += unique.join('\n');

            await message.channel.send('```' + botReply + '```').catch(console.error);
        }
    };

    // Lookup target member from database
    const { getNames } = require('../database/interface.js');
    await getNames(target.user, sendOutput);
}
