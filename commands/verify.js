const { server, channels, roles, seed } = require('../config.json');
const { getPad } = require('../random.js');

// Export command so it can be used
module.exports = {
	name: 'verify',
	description: 'Checks if a given verification code is correct and updates user role',
	execute: execute,
};

// Actual command to execute
async function execute(client, message, args) {

    let botReply;
    const guild = await client.guilds.get(server.id);
    const member = await guild.members.get(message.author.id);

    // Ignore messages outside of DM or verification channel
    if (message.guild != null && message.channel.id != channels.verify) return;

    // Invalid code entered
    if (args.length == 0 || !args[0].match(/[\d]{6}/)) {
        botReply = "Please enter a valid verification code. " +
                "It should be in this format: `!verify xxxxxx`";
    }

    // Member is already verified
    else if (member.roles.has(roles.verified)) {
        botReply = "You have already been verified. If you can't talk in the server, please message an exec.";
    }

    // Verification successful
    else if (args == getPad(message.author.tag.toLowerCase() + seed, 6)) {
        botReply = "Congratulations, you have been successfully verified. " +
                `**Welcome to ${server.name}!** You may now chat in the server.`;
        
        // Add verified role to member
        await member.addRole(roles.verified).catch(console.error);
    }

    // Incorrect code entered
    else {
        botReply = "**Sorry, your verification code was incorrect. Please try the following:**\n" +
                "1. Check that the code was entered correctly and try again.\n" +
                "2. Check that your Discord tag is the same as what you entered into the form and try again.\n" +
                `3. Ping an @exec in the #verification channel or email us at ${server.email} if it's still not working.`;
    }

    // Send message to member
    await message.author.send(botReply).catch(console.error);
}