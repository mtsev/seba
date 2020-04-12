const { categories, roles } = require('../config.json');

// Export command so it can be used
module.exports = {
    name: 'hide',
    description: 'Hide Discord event category from verified members',
    privileged: true,
    execute: execute,
};

// Actual command to execute
async function execute(guild, message, args) {

    let botReply;

    // Ignore messages outside of exec category
    if (message.channel.type !== 'text' || message.channel.parentID !== categories.exec) return;

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
            let d = new Date();
            console.error(`[${d.toLocaleString()}] Couldn't hide '${args[0]}':`, error);
        }

        botReply = `${category.name} has been hidden from members.`;
    }

    // Invalid arguments
    else {
        botReply = `\`usage: !hide (${Object.keys(categories.moveable).join('|')})\``;
    }

    await message.reply(botReply).catch(console.error);
}
