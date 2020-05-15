// Export command so it can be used
module.exports = {
    name:        'emoji',
    description: 'Restrict the usage of an emoji to specific roles. ',
    usage:       '(add|remove|set) <emoji name> <role names...>',
    privileged:  true,
    execute:     execute
};

// Actual command to execute
async function execute(guild, message, args) {
    let botReply;

    // Ignore DMs
    if (message.channel.type !== 'text') return;

    // Accepts two arguments, emoji and role
    if (args.length !== 3 || !['add', 'remove', 'set'].includes(args[0])) {
        botReply = `\`usage: ${message.client.prefix}${module.exports.name} ` +
                       `${module.exports.usage}\``;
        await message.reply(botReply).catch(console.error);
        return;
    }

    // Get emoji
    var emoji = guild.emojis.cache.find(e => e.name === args[1]);
    if (!emoji) {
        botReply = `couldn't find emoji called \`${args[1]}\``;
        await message.reply(botReply).catch(console.error);
        return;
    }

    // Get role
    var role = guild.roles.cache.find(r => r.name === args[2]);
    if (!role) {
        botReply = `couldn't find role called \`${args[2]}\``;
        await message.reply(botReply).catch(console.error);
        return;
    }

    // Set role restriction to emoji
    switch (args[0]) {
    case 'add':
        await emoji.roles.add([role]).catch(console.error);
        console.log(`Added role '${role.name}' to emoji :${emoji.name}:`);
        botReply = `:${emoji.name}: can now be used by \`${role.name}\``;
        break;

    case 'set':
        await emoji.roles.set([role]).catch(console.error);
        console.log(`Set role '${role.name}' to emoji :${emoji.name}:`);
        botReply = `:${emoji.name}: can now only be used by \`${role.name}\``;
        break;

    case 'remove':
        await emoji.roles.remove([role]).catch(console.error);
        console.log(`Removed role '${role.name}' from emoji :${emoji.name}:`);
        botReply = `removed role \`${role.name}\` from :${emoji.name}:`;
        break;
    }

    await message.reply(botReply).catch(console.error);
}
