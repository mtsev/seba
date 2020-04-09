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
    let d = new Date();

    // Ignore messages outside of exec category
    if (message.channel.type !== 'text' || message.channel.parentID != categories.exec) return;

    // Invalid arguments
    if (args.length === 1 && args[0] in categories.events) {
        
        // Get category object
        const category = await guild.channels.get(categories.events[args[0]]);

        // Move category into position
        await category.setPosition(2)
                .then(newChannel => console.log(`${category.name}'s new position is ${newChannel.position}`))
                .catch(console.error);

        // Allow verified members to access channels
        await category.overwritePermissions(guild.roles.get(roles.verified), {
            VIEW_CHANNEL: true,
            SEND_MESSAGES: true,
            CONNECT: true
        })
            .then(updated => console.log(updated.permissionOverwrites.get(roles.verified)))
            .catch(console.error);

        // Allow everyone to see channels
        await category.overwritePermissions(guild.roles.get(guild.id), {
            VIEW_CHANNEL: true
        })
            .then(updated => console.log(updated.permissionOverwrites.get(guild.id)))
            .catch(console.error);
        
        // Sync permissions for all channels
        category.children.forEach(async channel => {
            console.log(`Trying to sync ${channel.name}`);
            await channel.lockPermissions()   
                .then(() => console.log(`Sync'd permissions for ${channel.name}`))
                .catch(console.error);
        });

        botReply = `${category.name} is now visible and accessible for verified members.`;

    }

    // Invalid arguments
    else {
        botReply = `\`usage: !show {${Object.keys(categories.events).join('|')}}\``;
    }

    await message.reply(botReply).catch(console.error);

}