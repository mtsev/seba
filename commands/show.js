const { categories, roles } = require('../config.json');

// Export command so it can be used
module.exports = {
    name:        'show',
    description: 'Give verified members access to a category. Can be used in any channel.',
    usage:       `<category>\n  category: ${Object.keys(categories.moveable).join(', ')}`,
    privileged:  true,
    execute:     execute
};

// Actual command to execute
async function execute(guild, message, args) {
    // Ignore DMs
    if (message.channel.type !== 'text') return;

    // Take one moveable category as argument
    if (args.length !== 1 || !(args[0].toLowerCase() in categories.moveable)) {
        const botReply = `usage: ${message.client.prefix}${module.exports.name} ` +
                         `${module.exports.usage}`;
        const msg = await message.reply('```' + botReply + '```').catch(console.error);
        await msg.delete({ timeout: 10000 }).catch(console.error);
        return;
    }

    // Get category object
    const target = args[0].toLowerCase();
    const category = guild.channels.cache.get(categories.moveable[target]);
    const permsTable = [];

    try {
        // Move category into position
        await category.setPosition(1);

        // Allow verified members to access channels
        await category.updateOverwrite(roles.verified, {
            VIEW_CHANNEL:  true,
            SEND_MESSAGES: true,
            CONNECT:       true
        });

        // Log the perms for category for debugging
        permsTable.push(getPerms(category, roles.verified));

        // Allow everyone to see channels
        await category.updateOverwrite(guild.id, {
            VIEW_CHANNEL: true
        });

        // Sync permissions for all channels
        for (const channel of category.children.values()) {
            // Only sync if necessary
            if (!channel.permissionsLocked) {
                console.log('Syncing perms for', channel.name);
                await channel.lockPermissions();
            }

            // Log the perms for each channel for debugging
            permsTable.push(getPerms(channel, roles.verified));
        }

        // Log perms table
        console.table(permsTable);

        // Success message
        const botReply = `${category.name} is now visible and accessible ` +
                       'for verified members';
        await message.channel.send(botReply).catch(console.error);
    } catch (error) {
        console.error(`Couldn't show '${target}':`, error);
        throw error;
    }
}

function getPerms(channel, role) {
    const perms = channel.permissionsFor(role).serialize(true);
    return {
        channel:       channel.name,
        VIEW_CHANNEL:  perms.VIEW_CHANNEL,
        SEND_MESSAGES: perms.SEND_MESSAGES,
        CONNECT:       perms.CONNECT
    };
}
