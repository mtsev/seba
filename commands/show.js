const { categories, roles } = require('../config.json');

// Export command so it can be used
module.exports = {
    name:        'show',
    description: 'Give verified members access to a category. If no category is given, ' +
                 'will show the category that the command was sent in.',
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
    const permsTable = [];

    // Two valid modes of operation:
    // 1. No argument provided. Show the category that the command was sent in.
    if (args.length === 0) {
        // Check that the category is not locked.
        if (message.channel.parentID in Object.values(categories.locked)) {
            const botReply = `Cannot show locked category '${message.channel.name}''`;
            await message.channel.send(botReply).catch(console.error);
            return;
        }

        target = 'message category';
        category = message.channel.parent;
    }

    // 2. Show the category identified by the tag in the argument.
    else {
        // Check that the argument is a known category tag.
        if (!(args[0].toLowerCase() in categories.events)) {
            const botReply = `Unknown events category '${args[0]}'.`;
            await message.channel.send(botReply).catch(console.error);
            return;
        }

        target = args[0].toLowerCase();
        category = guild.channels.cache.get(categories.events[target]);
    }

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
