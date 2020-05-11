const { categories, roles } = require('../config.json');

// Export command so it can be used
module.exports = {
    name: 'hide',
    description: 'Hide category from verified members. Can be used in any channel.',
    usage: `(${Object.keys(categories.moveable).join('|')})`,
    privileged: true,
    execute: execute,
};

// Actual command to execute
async function execute(guild, message, args) {

    // Ignore DMs
    if (message.channel.type !== 'text') return;

    // Invalid arguments given
    if (args.length !== 1 || !(args[0] in categories.moveable)) {
        let botReply = `\`usage: ${message.client.prefix}${module.exports.name} ` +
                       `${module.exports.usage}\``;
        await message.reply(botReply).catch(console.error);
        return;
    }
        
    // Get category object
    const category = guild.channels.cache.get(categories.moveable[args[0]]);
    const position = guild.channels.cache.get(categories.exec).position + 1;
    const permsTable = [];

    try {
        // Remove verified members permissions
        await category.updateOverwrite(roles.verified, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            CONNECT: false
        });

        // Log the perms for category for debugging
        permsTable.push(getPerms(category, roles.verified));

        // Hide channels from everyone
        await category.updateOverwrite(guild.id, {
            VIEW_CHANNEL: false
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

        // Move category into position
        await category.setPosition(position);

        // Log perms table
        console.table(permsTable);

        // Success message
        let botReply = `${category.name} has been hidden from members`;
        await message.reply(botReply).catch(console.error);

    } catch (error) {
        console.error(`Couldn't hide '${args[0]}':`, error);
        throw error;
    }
}

function getPerms(channel, role) {
    const perms = channel.permissionsFor(role).serialize(true);
    return { 
        channel: channel.name,
        VIEW_CHANNEL: perms.VIEW_CHANNEL,
        SEND_MESSAGES: perms.SEND_MESSAGES,
        CONNECT: perms.CONNECT
    };
}
