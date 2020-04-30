const { categories } = require('../config.json');

// Export command so it can be used
module.exports = {
    name: 'archive',
    description: 'Move all channels in target category to archive category. ' +
                 'Default target is events. Can be used in any channel.',
    usage: `[(${Object.keys(categories.moveable).join('|')})]`,
    privileged: true,
    execute: execute,
};

// Actual command to execute
async function execute(guild, message, args) {

    let botReply;

    // Ignore DMs
    if (message.channel.type !== 'text') return;

    // Optionally take one argument
    if (!args[0] || args.length === 1 && args[0] in categories.moveable) {

        // Default target is 'events'
        const target = args[0] ? args[0] : 'events';

        // Get target category
        const category = guild.channels.get(categories.moveable[target]);

        // Get archive category
        const archive = guild.channels.get(categories.archive);

        // Move all channels and sync permissions to archive
        for (let channel of category.children.values()) {
            try {
                await channel.setParent(archive);

                // Only sync if necessary
                if (!channel.permissionsLocked) {
                    console.log('Syncing perms for', channel.name);
                    await channel.lockPermissions();
                }

            } catch (error) {
                console.error(`Couldn't archive '${target}':`, error);
                throw error;
            }
        }

        botReply = `${category.name} has been archived`;
    }

    // Invalid arguments
    else {
        botReply = `\`usage: ${message.client.prefix}${module.exports.name} ${module.exports.usage}\``;
    }

    await message.reply(botReply).catch(console.error);
}
