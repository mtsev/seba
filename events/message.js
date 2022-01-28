const { prefix, server, categories, roles } = require('../config.json');

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
        let prefixMessage = `My prefix is \`${message.client.prefix}\`. ` +
        `A list of my commands can be found with \`${message.client.prefix}`;

        // For alphanumeric prefix (i.e. words), append whitespace for readability
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

    // Get guild object
    const guild = message.client.guilds.cache.get(server.id);

    // Log all command uses
    const channel = (message.channel.type === 'text') ? message.channel.name : 'DM';
    console.log(`<${message.author.tag}> ${message.content} (${channel})`);

    // Error message for `verify` is ping exec, but for exec is to ping me.
    let helper = '@NaCl#9482';

    // Only the `verify` command can be called by non-exec members or in DMs.
    // If we assume that `verify` will only ever be called with the default prefix
    // then we can extract out a specific handler for it.
    if (commandName !== 'verify') {
        const member = guild.member(message);
        if (!member.roles.cache.has(roles.exec) ||
            message.channel.type !== 'text') return;
    } else {
        helper = 'an @exec';
    }

    // Check that exec channel only commmands are being called in an exec channel.
    if (command.privileged &&
        message.channel.parentID !== categories.exec) return;

    // Execute command
    try {
        await command.execute(guild, message, args);
    } catch (error) {
        console.error(`Error executing command '${command.name}':`, error);
        let botReply = 'sorry, an error has occurred. ';
        if (!command.privileged) {
            botReply += `Please try again or ping ${helper} if the problem doesn't go away.`;
        }
        await message.reply(botReply).catch(console.error);
    }
}
