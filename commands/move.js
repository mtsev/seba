// Export command so it can be used
module.exports = {
    name: 'move',
    description: 'Move all members from one voice channel to another. ' +
                 'Can be used in any channel.',
    usage: '[from_channel] <to_channel>',
    privileged: true,
    execute: execute,
};

// Actual command to execute
async function execute(guild, message, args) {

    let botReply;
    let fromChannel;
    let toChannel;

    // Ignore DMs
    if (message.channel.type !== 'text') return;

    // If only one argument supplied, move from user's current channel
    if (args.length === 1) {

        // Get to and from channels
        fromChannel = guild.member(message).voice.channel;
        toChannel = guild.channels.cache.find(channel => channel.name === args[0]);

        // Check if channels exist
        if (!fromChannel) {
            botReply = "please join voice channel to move from or specify channel:" +
                        "```!move <from_channel> <to_channel>```";
        } else if (!toChannel) {
            botReply = `couldn't find channel #${args[0]}`;
        }
    }

    // If two arguments supplied, move from arg1 to arg2
    else if (args.length === 2) {
        fromChannel = guild.channels.cache.find(channel => channel.name === args[0]);
        toChannel = guild.channels.cache.find(channel => channel.name === args[1]);

        // Check if channels exist
        if (!fromChannel) {
            botReply = `couldn't find channel #${args[0]}`;
        } else if (!toChannel) {
            botReply = `couldn't find channel #${args[1]}`;
        }
    }

    // Incorrect arguments supplied
    else {
        botReply = `\`usage: ${message.client.prefix}${module.exports.name} ` +
                   `${module.exports.usage}\``;
    }

    // If nothing has gone wrong so far, go ahead with the move
    if (!botReply) {

        // Check that both channels are actually voice channels
        if (fromChannel.type !== 'voice') {
            botReply = `\`${fromChannel.name}\` is not a voice channel, please try again`;
        } else if (toChannel.type !== 'voice') {
            botReply = `\`${toChannel.name}\` is not a voice channel, please try again`;
        }

        // Good to go!
        else {
            // Move everyone
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

            // Set output message
            botReply = `moved everyone from \`${fromChannel.name}\` ` +
                       `to \`${toChannel.name}\``;
        }
    }

    // Send output to user
    await message.reply(botReply).catch(console.error);
}
