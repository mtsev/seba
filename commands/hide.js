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

    let botReply;

    // Ignore DMs
    if (message.channel.type !== 'text') return;

    // Check correct arguments are given
    if (args.length === 1 && args[0] in categories.moveable) {
        
        // Get category object
        const category = guild.channels.get(categories.moveable[args[0]]);
        const position = guild.channels.get(categories.exec).position + 1;

        try {

            // Remove verified members permissions
            await category.overwritePermissions(guild.roles.get(roles.verified), {
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
                CONNECT: false
            });

            // Hide channels from everyone
            await category.overwritePermissions(guild.roles.get(guild.id), {
                VIEW_CHANNEL: false
            });

            // Sync permissions for all channels
            category.children.forEach(async channel => {
                await channel.lockPermissions();
            });

            // Move category into position
            await category.setPosition(position);

        } catch (error) {
            console.error(`Couldn't hide '${args[0]}':`, error);
        }

        botReply = `${category.name} has been hidden from members`;
    }

    // Invalid arguments
    else {
        botReply = `\`usage: ${message.client.prefix}${module.exports.name} ${module.exports.usage}\``;
    }

    await message.reply(botReply).catch(console.error);
}
