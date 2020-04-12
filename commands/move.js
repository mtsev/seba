const { categories, channels, roles } = require('../config.json');

// Export command so it can be used
module.exports = {
    name: 'move',
    description: 'Move all members in the user\'s voice channel to another voice channel',
    privileged: true,
    execute: execute,
};

// Actual command to execute
async function execute(guild, message, args) {

    let botReply;

    // Check that command is called in allowed channels

    // Check that command is called with correct arguments

    // Check that user is in a voice channel

    // Find target channel

    // Iterate through members in current channel

        // Move each member to target channel



    // DEBUG MESSAGE
    botReply = `\`move\` called with the following arguments: \`${args}\``;

    await message.reply(botReply).catch(console.error);

}
