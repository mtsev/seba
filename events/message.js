const { prefix, server, roles } = require('../config.json');

// Export event so it can be used
module.exports = async (client, message) => {
    await handleCommands(message);
}

// Command handler
async function handleCommands(message) {

    // Ignore messages from bots
    if (message.author.bot) return;

    // Get prefix for client
    const customPrefix = message.client.prefix;

    // Check whether default or custom prefix is being used
    let usedPrefix;
    if (message.content.startsWith(customPrefix)) {
        usedPrefix = customPrefix;
    } else if (message.content.startsWith(prefix)) {
        usedPrefix = prefix;
    } else {
        return;
    }

    // Parse message
    const args = message.content.slice(usedPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = message.client.commands.get(commandName);

    // Ignore invalid command
    if (!command) return;

    // Only allow non-privileged commands to use default prefix
    if (command.privileged && usedPrefix != customPrefix) return;

    // Get guild
    var guild = message.client.guilds.get(server.id);

    // Log all command uses
    let channel = (message.channel.type === 'text') ? message.channel.name : 'DM';
    console.log(`<${message.author.tag}> ${message.content} (${channel})`);

    // Check for exec only commmands
    if (command.privileged) {
        const member = guild.member(message);
        if (!member.roles.has(roles.exec)) return;
    }
    
    // Execute command
    try {
        await command.execute(guild, message, args);
    } catch (error) {
        console.error(command.name + ':', error);
        await message.reply("Sorry, an error has occurred. " +
            "Please try again or ping an @exec if the problem doesn't go away.");
    }
}
