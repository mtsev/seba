const { server, channels, roles, seed } = require('../config.json');
const { getPad } = require('../modules/random.js');

// Export command so it can be used
module.exports = {
    name:        'verify',
    description: 'Check if given verification code is correct and update user role. ' +
                 'Can only be used in verification channel or DM.',
    usage:      '<verification_code>',
    privileged: false,
    execute:    execute
};

// Actual command to execute
async function execute(guild, message, args) {
    // Ignore messages outside of DM or verification channel
    if (message.channel.type === 'text' && message.channel.id !== channels.verify) return;

    let botReply;
    const code = getPad(message.author.tag.toLowerCase() + seed, 6);
    const member = guild.member(message);

    // If the member isn't in the server, this should never happen
    if (!member) {
        console.error(`'verify' called by ${message.author.tag} not in server`);
        return;
    }

    // Invalid code entered
    if (args.length === 0 || !args[0].match(/[\d]{6}/)) {
        botReply = 'Please enter a valid verification code. ' +
                   'It should be in this format: `!verify xxxxxx`';
    }

    // Member is already verified
    else if (member.roles.cache.has(roles.verified)) {
        botReply = 'You have already been verified. ' +
                   "If you can't talk in the server, please message an exec.";
    }

    // Verification successful
    else if (args[0] === code) {
        // Optional database feature, check client if enabled
        if (message.client.database) {
            const { addVerified, addUsername } = require('../database/interface.js');

            // Add new verified member to database
            // TODO -- indicate failure to admins
            await addVerified(member.user);

            // Start tracking username history
            await addUsername(member.user);
        }

        // Add verified role to member
        await member.roles.add(roles.verified).catch(console.error);

        // Output to user
        botReply = 'Congratulations, you have been successfully verified. ' +
                `**Welcome to ${server.name}!** You may now chat in the server.`;
    }

    // Incorrect code entered
    else {
        // Get name of verification channel
        const verification = guild.channels.cache.get(channels.verify).name;

        botReply = '**Sorry, your verification code was incorrect. ' +
            'Please try the following:**\n' +
            '1. Check that the code was entered correctly and try again.\n' +
            '2. Check that your Discord tag is the same as what you entered ' +
            'into the form and try again.\n' +
            `3. Ping an @exec in the #${verification} channel or email us ` +
            `at ${server.email} if it's still not working.`;
    }

    // Send DM message to member
    try {
        await message.author.send(botReply);
    } catch (error) {
        // If we successfully verified the member, don't do anything
        if (member.roles.cache.has(roles.verified)) return;

        // Cannot direct message member
        if (error.code === 50007) {
            console.error(`Couldn't DM user ${message.author.tag}`);

            // Send error message to user in channel
            const errorMessage = "I couldn't send you a DM. " +
                "Please go to 'Privacy Settings' for this server " +
                'and allow direct messages from server members.';
            const msg = await message.reply(errorMessage).catch(console.error);

            // Delete error message after 10 seconds
            await msg.delete({ timeout: 10000 }).catch(console.error);
        } else {
            console.error(error);
            throw error;
        }
    }
}
