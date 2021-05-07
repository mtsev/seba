const { prefix, server, roles } = require('../config.json');

// Export event so it can be used
module.exports = async (client, message) => {
    await handleCommands(message);
};

// Command handler
async function handleCommands(message) {
    // Ignore messages from bots
    if (message.author.bot) return;

    // If seba gets pinged, reply with prefix
    if (message.mentions.has(message.client.user, { ignoreRoles: true, ignoreEveryone: true })) {
        let prefixMessage = `My prefix is \`${message.client.prefix}\`. A list of my commands can be found with \`${message.client.prefix}`;
        if (/[a-zA-Z0-9]$/.test(message.client.prefix)) prefixMessage += ' ';
        prefixMessage += 'help.`';
        await message.channel.send(prefixMessage).catch(console.error);
        return;
    }

    // We want 'verify' to accept default prefix since that's hardcoded
    // in the email sent by the google form.
    let commandPrefix;
    if (message.content.startsWith(prefix + 'verify')) {
        commandPrefix = prefix;
    } else if (message.content.startsWith(message.client.prefix)) {
        commandPrefix = message.client.prefix;
    } else {
        return;
    }

    // Parse message
    const args = message.content.slice(commandPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = message.client.commands.get(commandName) ||
        message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // Ignore invalid command
    if (!command) return;

    // Get guild
    const guild = message.client.guilds.cache.get(server.id);

    // Log all command uses
    const channel = (message.channel.type === 'text') ? message.channel.name : 'DM';
    console.log(`<${message.author.tag}> ${message.content} (${channel})`);

    // Check for exec only commmands
    if (command.privileged) {
        const member = guild.member(message);
        if (!member.roles.cache.has(roles.exec)) return;
    }

    // Execute command
    try {
        await command.execute(guild, message, args);
    } catch (error) {
        console.error(`Error executing command '${command.name}':`, error);
        let botReply = 'sorry, an error has occurred. ';
        if (!command.privileged) {
            botReply += "Please try again or ping an @exec if the problem doesn't go away.";
        }
        await message.reply(botReply).catch(console.error);
    }
}
