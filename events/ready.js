const { server } = require('../config.json');

// Export event so it can be used
module.exports = (client) => {

    // Log init to console
    console.log(`[${new Date().toLocaleString()}] Logged in as ${client.user.tag}!`);

    // Get guild
    guild = client.guilds.get(server.id);

    // Bonus features
    if (client.bonus) {

        // Late nights
        const { showLateNights, hideLateNights } = require('../modules/latenights.js');
        showLateNights(guild).start();
        hideLateNights(guild).start();
    }
    
}
