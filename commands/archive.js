const { categories, channels, roles } = require('../config.json');

// Export command so it can be used
module.exports = {
    name: 'archive',
    description: 'Move all channels in target category to events archive category',
    privileged: true,
    execute: execute,
};

// Actual command to execute
async function execute(guild, message, args) {

    let botReply;

    // Check that command is called in allowed channels

    // Check that command is called with correct arguments

    // Get target category

    // Get archive category

    // Get archive position

    // Loop through channels
        // Move channel to top of archive
        // Sync channel permissions



    // DEBUG MESSAGE
    botReply = `\`archive\` called with the following arguments: \`${args}\``;

    await message.reply(botReply).catch(console.error);

}
