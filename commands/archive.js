const { categories } = require('../config.json');

// Export command so it can be used
module.exports = {
    name: 'archive',
    description: 'Move all channels in target category to archive category. Default target is events.',
    privileged: true,
    execute: execute,
};

// Actual command to execute
async function execute(guild, message, args) {

    let botReply;

    // Ignore messages outside of exec category
    if (message.channel.type !== 'text' || message.channel.parentID !== categories.exec) return;

    // Optionally take one argument
    if (!args[0] || args.length === 1 && args[0] in categories.moveable) {

        // Default target is 'events'
        const target = args[0] ? args[0] : 'events';

        // Get target category
        const category = guild.channels.get(categories.moveable[target]);

        // Get archive category
        const archive = guild.channels.get(categories.archive);

        // Move all channels and sync permissions to archive
        category.children.forEach(async channel => {
            try {
                await channel.setParent(archive);
                await channel.lockPermissions();
            } catch (error) {
                let d = new Date();
                console.error(`[${d.toLocaleString()}] Couldn't archive '${target}':`, error);
            }

        });

        botReply = `${category.name} has been archived`;
    }

    // Invalid arguments
    else {
        botReply = `\`usage: !archive [(${Object.keys(categories.moveable).join('|')})]\``;
    }

    await message.reply(botReply).catch(console.error);

}
