const { prefix, server, channels, roles } = require('../config.json');

// Export event so it can be used
module.exports = async (client, message) => {
    await handleCommands(message);
    await modmail(message);
};

// Command handler
async function handleCommands(message) {
    // Ignore messages from bots
    if (message.author.bot) return;

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

// Relay DMs to exec channel
async function modmail(message) {
    if (message.channel.type !== 'dm' || message.author.bot ||
        message.content.startsWith(message.client.prefix)) return;

    console.log(`Modmail received from ${message.author.tag}`);

    const mail = `<${message.author.tag}> ${message.content}`;
    const modchannel = message.client.channels.cache.get(channels.modmail);

    modchannel.send('```markdown\n' + mail + '```').catch(console.error);
    message.reply("We've received your message and we'll get back to you shortly.");
}
