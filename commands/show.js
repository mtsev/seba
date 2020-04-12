const { categories, roles } = require('../config.json');

// Export command so it can be used
module.exports = {
    name: 'show',
    description: 'Give access verified members access to Discord event category',
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
            await category.overwritePermissions(guild.roles.get(guild.id), {
                VIEW_CHANNEL: true
            });
            
            // Sync permissions for all channels
            category.children.forEach(async channel => {
                await channel.lockPermissions();
            });

        } catch (error) {
            let d = new Date();
            console.error(`[${d.toLocaleString()}] Couldn't show '${args[0]}':`, error);
        }

        botReply = `${category.name} is now visible and accessible for verified members.`;
    }

    // Invalid arguments
    else {
        botReply = `\`usage: !show (${Object.keys(categories.moveable).join('|')})\``;
    }

    await message.reply(botReply).catch(console.error);
}
