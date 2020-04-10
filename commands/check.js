const { channels, roles, seed } = require('../config.json');
const { getPad } = require('../random.js');

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

    // Ignore messages outside of DM or verification channel
    if (message.channel.type === 'text' && message.channel.id !== channels.verify) return;

    // One argument, return target member's verification code
    if (args.length === 1) {

        var target;
        const code = getPad(message.author.tag.toLowerCase() + seed, 6);
        const taggedUser = message.mentions.users.first();
        
        // Parse argument to get target member
        if (taggedUser) {
            target = guild.member(taggedUser);
        } else if (args[0].includes('#')) {
            target = guild.members.find(member => member.user.tag === args[0]);
        } else {
            target = guild.members.find(member => member.user.username === args[0]);
        }

        // Check that the target member is actually in the server
        if (!target) {
            botReply = `Couldn't find \`${args[0]}\` in the server`;
        }

        // Check if user has already been verified
        else if (target.roles.has(roles.verified)) {
            botReply = `\`${target.user.tag}\` is already verified with code \`${code}\``;
        }

        // Output verification code
        else {
            botReply = `\`${target.user.tag}\` has verification code \`${code}\``;
        }
    }

    // Wrong number of arguments
    else {
        botReply = '`usage: !check <username>`';
    }

    // Send message to member
    await message.author.send(botReply).catch(console.error);
}