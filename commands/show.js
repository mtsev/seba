const { categories, roles } = require('../config.json');

// Export command so it can be used
module.exports = {
    name: 'show',
    description: 'Give verified members access to a category. Can be used in any channel.',
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

        try{
            // Move category into position
            await category.setPosition(2);

            // Allow verified members to access channels
            await category.overwritePermissions(guild.roles.get(roles.verified), {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                CONNECT: true
            });

            // Allow everyone to see channels
            await category.overwritePermissions(guild.defaultRole, {
                VIEW_CHANNEL: true
            });
            
            // Sync permissions for all channels
            category.children.forEach(async channel => {
                await channel.lockPermissions();
            });

        } catch (error) {
            console.error(`Couldn't show '${args[0]}':`, error);
        }

        botReply = `${category.name} is now visible and accessible for verified members`;
    }

    // Invalid arguments
    else {
        botReply = `\`usage: ${message.client.prefix}${module.exports.name} ${module.exports.usage}\``;
    }

    await message.reply(botReply).catch(console.error);
}
