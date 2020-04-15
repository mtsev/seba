const { server } = require('../config.json');
const { showLateNights, hideLateNights } = require('../modules/latenights.js');


// Export event so it can be used
module.exports = (client) => {

    // Log init to console
    console.log(`[${new Date().toLocaleString()}] Logged in as ${client.user.tag}!`);

    // Get guild
    guild = client.guilds.get(server.id);

    // Start late night cron jobs
    showLateNights(guild).start();
    hideLateNights(guild).start();
}

