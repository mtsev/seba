const { categories } = require('../config.json');

// Export command so it can be used
module.exports = {
    name: 'archive',
    description: "Move all channels in target category to archive category. " +
                 "Default target is 'events'. Can be used in any channel.",
    usage: `[(${Object.keys(categories.moveable).join('|')})]`,
    privileged: true,
    execute: execute,
};

// Actual command to execute
async function execute(guild, message, args) {

    // Ignore DMs
    if (message.channel.type !== 'text') return;

    // Optionally take one argument
    if ((args.length === 1 && !(args[0] in categories.moveable)) || args.length > 1) {
        let botReply = `\`usage: ${message.client.prefix}${module.exports.name} ${module.exports.usage}\``;
        await message.reply(botReply).catch(console.error);
        return
    }

    // Default target is 'events'
    const target = args[0] ? args[0] : 'events';

    // Get target category
    const category = guild.channels.cache.get(categories.moveable[target]);

    // Get archive category
    const archive = guild.channels.cache.get(categories.archive);

    // Move all channels and sync permissions to archive
    for (const channel of category.children.values()) {
        try {
            await channel.setParent(archive);

            // Only sync if necessary
            if (!channel.permissionsLocked) {
                console.log('Syncing perms for', channel.name);
                await channel.lockPermissions();
            }

        } catch (error) {
            console.error(`Couldn't archive '${channel.name}' in '${target}':`, error);
            throw error;
        }
    }

    let botReply = `${category.name} has been archived`;
    await message.reply(botReply).catch(console.error);
}
