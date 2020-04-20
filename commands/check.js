const { categories, channels, roles, seed } = require('../config.json');
const { getPad } = require('../modules/random.js');

// Export command so it can be used
module.exports = {
    name: 'check',
    description: 'Check what the verification code of a given user is',
    privileged: true,
    execute: execute,
};

// Actual command to execute
async function execute(guild, message, args) {

    let botReply;

    // Ignore messages outside verification channel or exec channels
    if (message.channel.parentID !== categories.exec && message.channel.id !== channels.verify) return;

    // Missing argument(s)
    if (args.length === 0) {
        let botReply = '`usage: !lookup <username>`';
        await message.reply(botReply).catch(console.error);
        return;
    }

    // Concatenate all arguments into a single string
    let arg = args.join(' ');

    let target;
    const code = getPad(message.author.tag.toLowerCase() + seed, 6);
    const taggedUser = message.mentions.users.first();
    
    // Parse argument to get target member
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
        botReply = `couldn't find \`${arg}\` in the server`;
    }

    // Check if user has already been verified
    else if (target.roles.has(roles.verified)) {
        botReply = `\`${target.user.tag}\` is already verified with code \`${code}\``;
    }

    // Output verification code
    else {
        botReply = `\`${target.user.tag}\` has verification code \`${code}\``;
    }

    // Send message to member
    await message.reply(botReply).catch(console.error);
}
