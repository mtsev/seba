const { prefix, server, roles } = require('../config.json');

// Export event so it can be used
module.exports = async (client, message) => {
    await handleCommands(message);
}

// Command handler
async function handleCommands(message) {

    // Ignore non-commands and messages from bots
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Parse message
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = message.client.commands.get(commandName);

    // Get guild
    var guild = message.client.guilds.get(server.id);

    // Ignore invalid command
    if (!command) return;

    // Log all command uses
    let channel = (message.channel.type === 'text') ? message.channel.name : 'DM';
    console.log(`[${new Date().toLocaleString()}] <${message.author.tag}> !${commandName} ${args} (${channel})`);

    // Check for exec only commmands
    if (command.privileged) {
        const member = guild.member(message);
        if (!member.roles.has(roles.exec)) return;
    }
    
    // Execute command
    try {
        await command.execute(guild, message, args);
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}]`, error);
        await message.reply("Sorry, an error has occurred. " +
            "Please try again or ping an @exec if the problem doesn't go away.");
    }
}
