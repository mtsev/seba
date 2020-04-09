const { server, channels, roles, seed } = require('../config.json');
const { getPad } = require('../random.js');

// Export command so it can be used
module.exports = {
	name: 'check',
	description: 'Check if user code is correct or generate code if none entered',
	execute: execute,
};

// Actual command to execute
async function execute(client, message, args) {

    let botReply;
    const guild = await client.guilds.get(server.id);
    const member = await guild.members.get(message.author.id);

    // Ignore command if member isn't an exec
    if (!member.roles.has(roles.exec)) return;

    // Ignore messages outside of DM or verification channel
    if (message.guild != null && message.channel.id != channels.verify) return;

    // One argument, return target member's verification code
    if (args.length == 1) {

        var target;
        const taggedUser = message.mentions.users.first();
        
        // Parse argument to get target member
        if (taggedUser) {
            target = guild.members.get(taggedUser.id);
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
            const code = getPad(target.user.tag.toLowerCase() + seed, 6);
            botReply = `\`${target.user.tag}\` is already verified with code \`${code}\``;
        }

        // Generate verification code
        else {
            const code = getPad(target.user.tag.toLowerCase() + seed, 6);
            botReply = `\`${target.user.tag}\` has verification code \`${code}\``;
        }
    }

    // Wrong number of arguments
    else {
        botReply = "`usage: !verify <username>`";
    }

    // Send message to member
    await message.author.send(botReply).catch(console.error);
}