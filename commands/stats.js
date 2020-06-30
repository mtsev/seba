const { categories, channels, roles } = require('../config.json');

// Export command so it can be used
module.exports = {
    name:        'stats',
    description: 'Get statistics on how announcements in Discord have performed. ' +
                 'Can only be used in exec channels.',
    usage:      '',
    privileged: true,
    execute:    execute
};

// Actual command to execute
async function execute(guild, message, args) {
    // Ignore messages outside of exec category
    if (message.channel.type !== 'text' ||
        message.channel.parentID !== categories.exec) return;

    // Get the announcements channel
    const channel = guild.channels.cache.get(channels.announce);

    // Dictionary to store statistics for summary
    const summary = new Map();

    // Extract: day, time, reacts
    const messages = await channel.messages.fetch();
    for (const message of messages.values()) {
        // Ignore messages from bots and less than 200 chars in length
        if (message.author.bot || message.cleanContent.length < 200) continue;

        const reactors = new Set();
        for (const react of message.reactions.cache.values()) {
            const users = await react.users.fetch();
            for (const user of users.keys()) {
                reactors.add(user);
            }
        }

        // Breakdown reacts for execs and members
        let exec = 0;
        let member = 0;
        for (const user of reactors.keys()) {
            const mem = guild.member(user);
            if (mem && mem.roles.cache.has(roles.exec)) {
                exec++;
            } else {
                member++;
            }
        }

        // Round time to nearest 30min
        const ms = 1000 * 60 * 30;
        const date = new Date(Math.round(message.createdAt.getTime() / ms) * ms);
        const options = {
            weekday: 'short',
            hour12:  false,
            hour:    '2-digit',
            minute:  '2-digit'
        };
        const time = date.toLocaleString('en-AU', options);

        // Collate frequency of each time along with average
        if (summary.has(time)) {
            summary.get(time).push(member);
        } else {
            summary.set(time, [member]);
        }
    }

    // Print summary to user
    let botReply = 'Average non-exec reacts for announcements by time:\n\n';
    const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
    for (const t of [...summary].sort((a, b) => (avg(a[1]) < avg(b[1]) ? 1 : -1))) {
        botReply += `${t[0]} - ${avg(t[1]).toFixed(2)} (${t[1].length} posts)\n`;
    }
    await message.channel.send('```' + botReply + '```').catch(console.error);
}
