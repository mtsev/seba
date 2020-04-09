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
    let d = new Date();

    // Ignore messages outside of exec category
    if (message.channel.type !== 'text' || message.channel.parentID != categories.exec) return;

    // Invalid arguments
    if (args.length === 1 && args[0] in categories.events) {
        
        // Get category object
        const category = guild.channels.get(categories.events[args[0]]);
        const position = guild.channels.get(categories.exec).position + 1;

        // Move category into position
        category.setPosition(position)
                .then(newChannel => console.log(`${category.name}'s new position is ${newChannel.position}`))
                .catch(console.error);

        // Sync permissions for all channels
        category.children.forEach(channel => {
            console.log(`Trying to sync ${channel.name}`);
            channel.lockPermissions()   
                .then(() => console.log(`Sync'd permissions for ${channel.name}`))
                .catch(console.error);
        });

        // Remove verified members permissions
        category.overwritePermissions(guild.roles.get(roles.verified), {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            CONNECT: false
        })
            .then(updated => console.log(updated.permissionOverwrites.get(roles.verified)))
            .catch(console.error);

        // Hide channels from everyone
        category.overwritePermissions(guild.roles.get(guild.id), {
            VIEW_CHANNEL: false
        })
            .then(updated => console.log(updated.permissionOverwrites.get(guild.id)))
            .catch(console.error);


        botReply = `${category.name} has been hidden from members.`;

    }

    // Invalid arguments
    else {
        botReply = `\`usage: !hide {${Object.keys(categories.events).join('|')}}\``;
    }

    await message.reply(botReply).catch(console.error);

}