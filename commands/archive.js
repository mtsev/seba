const { categories } = require('../config.json');

// Export command so it can be used
module.exports = {
    name:        'archive',
    description: 'Move all channels in event category to archive category. ' +
                 'If no event category is given, will use the category that ' +
                 'the command was sent in.',
    usage:      `[category]\n  category: ${Object.keys(categories.events).join(', ')}`,
    privileged: false,
    execute:    execute
};

// Actual command to execute
async function execute(guild, message, args) {
    // Invalid number of arguments given
    if (args.length > 1) {
        const botReply = `usage: ${message.client.prefix}${module.exports.name} ` +
                         `${module.exports.usage}`;
        const msg = await message.reply('```' + botReply + '```').catch(console.error);
        await msg.delete({ timeout: 10000 }).catch(console.error);
        return;
    }

    let target;
    let category;
    const archive = guild.channels.cache.get(categories.archive);

    // Two valid modes of operation:
    // 1. No argument provided. Archive the category that the command was sent in.
    if (args.length === 0) {
        // Check that the category is not locked.
        if (Object.values(categories.locked).includes(message.channel.parentID)) {
            const botReply = `Cannot archive locked category \`${message.channel.parent.name}\``;
            const msg = await message.channel.send(botReply).catch(console.error);
            await msg.delete({ timeout: 2000 }).catch(console.error);
            console.log(botReply);
            return;
        }

        target = 'message category';
        category = message.channel.parent;
    }

    // 2. Archive the category identified by the tag in the argument.
    else {
        // Check that the argument is a known category tag.
        if (!(args[0].toLowerCase() in categories.events)) {
            const botReply = `Unknown events category '${args[0]}'.`;
            await message.channel.send(botReply).catch(console.error);
            console.log(botReply);
            return;
        }

        target = args[0].toLowerCase();
        category = guild.channels.cache.get(categories.events[target]);
    }

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
