// Export command so it can be used
module.exports = {
    name:        'move',
    description: 'Move all members from one voice channel to another. ' +
                 'Can be used in any channel.',
    usage:      '<dest_channel>',
    privileged: false,
    execute:    execute
};

// Actual command to execute
async function execute(guild, message, args) {
    let botReply;

    // Command must take the destination channel as an argument.
    if (args.length === 0) {
        botReply = `usage: ${message.client.prefix}${module.exports.name} ` +
                   `${module.exports.usage}`;
        const msg = await message.reply('```' + botReply + '```').catch(console.error);
        await msg.delete({ timeout: 10000 }).catch(console.error);
        return;
    }

    // Source is user's current voice channel.
    const fromChannel = guild.member(message).voice.channel;
    const toChannel = guild.channels.cache
        .find(channel => channel.type !== 'voice' &&
            channel.name.toLowerCase().contains(args.join(' ').toLowerCase()));

    // Check that both source and destination voice channels exist
    if (!fromChannel) {
        botReply = 'Please join voice channel to move from.';
    } else if (!toChannel) {
        botReply = `Couldn't find voice channel \`${args.join(' ')}\``;
    }

    // Otherwise, good to go! Let's move everyone.
    else {
        // Beware the rate limit. Hasn't been an issue recently but was before.
        for (const member of fromChannel.members.values()) {
            try {
                await member.voice.setChannel(toChannel);
            } catch (error) {
                console.error(`Couldn't move ${member.user.tag} from ` +
                                `'${fromChannel.name}' to '${toChannel.name}':`);
                console.error(error);
                throw error;
            }
        }

        botReply = `Moved everyone from \`${fromChannel.name}\` ` +
                    `to \`${toChannel.name}\``;
    }

    // Send output to user
    await message.channel.send(botReply).catch(console.error);
}
