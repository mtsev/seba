const { server } = require('../config.json');

// Export event so it can be used
module.exports = (client) => {

    // Log init to console
    console.log(`Logged in as ${client.user.tag}!`);

    // Get guild
    guild = client.guilds.cache.get(server.id);

    // Set status message
    client.user.setActivity('fb.com/unswlofisoc', { type: 'PLAYING' });

    // Extra features
    if (client.extra) {

        // Late nights
        const { setup } = require('../modules/latenights.js');
        setup(guild);
    }
}
