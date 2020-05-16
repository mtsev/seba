const { categories, channels, roles, seed } = require('../config.json');
const { getPad } = require('../modules/random.js');

// Export command so it can be used
module.exports = {
    name:        'check',
    aliases:     ['getcode', 'code'],
    description: 'Check what the verification code of a given member is. ' +
                 'Can be used in verification channel and exec channels.',
    usage:      '<discord_name>',
    privileged: true,
    execute:    execute
};

// Actual command to execute
async function execute(guild, message, args) {
    let botReply;

    // Ignore messages outside verification channel or exec channels
    if (message.channel.parentID !== categories.exec &&
        message.channel.id !== channels.verify) return;

    // Missing argument(s)
    if (args.length === 0) {
        botReply = `usage: ${message.client.prefix}${module.exports.name} ` +
                   `${module.exports.usage}`;
        const msg = await message.reply('```' + botReply + '```').catch(console.error);
        await msg.delete({ timeout: 10000 }).catch(console.error);
        return;
    }

    // Concatenate all arguments into a single string
    const arg = args.join(' ').toLowerCase();

    // Parse argument to get target member
    let target;
    const taggedUser = message.mentions.users.first();

    if (taggedUser) {
        target = guild.member(taggedUser);
    } else if (arg.includes('#')) {
        target = guild.members.cache
            .find(member => member.user.tag.toLowerCase() === arg);
    } else {
        target = guild.members.cache
            .find(member => member.user.username.toLowerCase() === arg);
    }

    // Check if the name entered was a nickname
    if (!target) {
        target = guild.members.cache
            .find(member => member.nickname &&
                member.nickname.toLowerCase() === arg);
    }

    // Check that the target member is actually in the server
    if (!target) {
        botReply = `Couldn't find \`${arg}\` in the server`;
    }

    // Check if user has already been verified
    else if (target.roles.cache.has(roles.verified)) {
        const code = getPad(target.user.tag.toLowerCase() + seed, 6);
        botReply = `\`${target.user.tag}\` is already verified with code \`${code}\``;
    }

    // Output verification code
    else {
        const code = getPad(target.user.tag.toLowerCase() + seed, 6);
        botReply = `\`${target.user.tag}\` has verification code \`${code}\``;
    }

    // Send message to member
    await message.channel.send(botReply).catch(console.error);
}
