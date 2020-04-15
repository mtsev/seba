const { server, channels } = require('../config.json');

// Export event so it can be used
module.exports = async (client, member) => {
    await welcome(member);
}

// Send welcome message
async function welcome(member) {
    const message = `Welcome to ${server.name}, ${member}! ` +
            `Please read the <#${channels.rules}> and verify yourself to start chatting.`;
    await member.client.channels.get(channels.welcome).send(message);
}