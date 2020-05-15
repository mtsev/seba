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

    // Accepts at least 3 arguments: subcommand, emoji and role
    if (args.length < 3 || !['add', 'remove', 'set'].includes(args[0])) {
        botReply = `\`usage: ${message.client.prefix}${module.exports.name} ` +
                       `${module.exports.usage}\``;
        await message.reply(botReply).catch(console.error);
        return;
    }

    // Parse arguments
    const subcommand = args.shift().toLowerCase(); // args[0]
    const emojiName = args.shift(); // args[1]

    // Get emoji
    const emoji = guild.emojis.cache.find(e => e.name === emojiName);
    if (!emoji) {
        botReply = `couldn't find emoji called \`${emojiName}\``;
        await message.reply(botReply).catch(console.error);
        return;
    }

    // Get roles
    const roles = [];
    const roleNames = [];
    args.forEach(arg => {
        guild.roles.cache.forEach(role => {
            // Specifically handle @everyone to avoid stupid pings
            if (role.name === arg ||
                    (role.name === '@everyone' && arg === 'everyone')) {
                roles.push(role);
                roleNames.push(arg);
            }
        });
    });

    if (roles.length === 0) {
        botReply = `couldn't find any roles matching: \`${args.join('`, `')}\``;
        await message.reply(botReply).catch(console.error);
        return;
    }

    // Set role restriction to emoji
    switch (subcommand) {
    case 'add':
        await emoji.roles.add(roles).catch(console.error);
        console.log(`Added roles '${roleNames.join("', '")}' to emoji :${emoji.name}:`);
        botReply = `${emoji} can now be used by: \`${roleNames.join('`, `')}\``;
        break;

    case 'set':
        await emoji.roles.set(roles).catch(console.error);
        console.log(`Set roles '${roleNames.join("', '")}' to emoji :${emoji.name}:`);
        botReply = `${emoji} can now only be used by: \`${roleNames.join('`, `')}\``;
        break;

    case 'remove':
        await emoji.roles.remove(roles).catch(console.error);
        console.log(`Removed roles '${roleNames.join("', '")}' from emoji :${emoji.name}:`);
        botReply = `removed role \`${roleNames.join('`, `')}\` from ${emoji}`;
        break;
    }

    // Make sure seba can actually use the emoji in his reply
    const seba = guild.roles.cache.get(guild.client.user.id);
    if (!emoji.roles.cache.has(seba)) {
        await emoji.roles.add(seba).catch(console.error);
    }
    await message.reply(botReply).catch(console.error);
}
