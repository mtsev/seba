// Export command so it can be used
module.exports = {
    name: 'prefix',
    description: 'Change the prefix for bot commands. Can be used in any channel.',
    usage: `<new prefix>`,
    privileged: true,
    execute: execute,
};

// Actual command to execute
async function execute(guild, message, args) {

    // Ignore DMs
    if (message.channel.type !== 'text') return;

    // Missing argument(s)
    if (args.length === 0) {
        let botReply = `\`usage: ${message.client.prefix}${module.exports.name} ${module.exports.usage}\``;
        await message.reply(botReply).catch(console.error);
        return;
    }

    // Concatenate all arguments into a single string
    let newPrefix = args.join(' ');

    // Set the new prefix
    message.client.prefix = newPrefix;

    // Reply with success
    console.log(`Set prefix to '${message.client.prefix}'`);
    await message.reply(`set prefix to \`${message.client.prefix}\``).catch(console.error);
}
