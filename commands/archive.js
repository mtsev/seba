const { categories } = require('../config.json');

// Export command so it can be used
module.exports = {
    name:        'archive',
    description: 'Move all channels in target category to archive category. ' +
                 'Can be used in any channel.',
    usage:      `<category>\n  category: ${Object.keys(categories.moveable).join(', ')}`,
    privileged: false,
    execute:    execute
};

// Actual command to execute
async function execute(guild, message, args) {
    // Take one moveable category as argument
    if (args.length !== 1 || !(args[0].toLowerCase() in categories.moveable)) {
        const botReply = `usage: ${message.client.prefix}${module.exports.name} ` +
                         `${module.exports.usage}`;
        const msg = await message.reply('```' + botReply + '```').catch(console.error);
        await msg.delete({ timeout: 10000 }).catch(console.error);
        return;
    }

    // Get categories
    const target = args[0].toLowerCase();
    const category = guild.channels.cache.get(categories.moveable[target]);
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

    const botReply = `${category.name} has been archived`;
    await message.channel.send(botReply).catch(console.error);
}
