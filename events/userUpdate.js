const { server, roles } = require('../config.json');

// Export event so it can be used
module.exports = async (client, oldUser, newUser) => {
    if (client.database) {
        usernameChange(oldUser, newUser);
    }
};

// Log username change to database
function usernameChange(oldUser, newUser) {
    // Get guild and member
    const guild = newUser.client.guilds.cache.get(server.id);
    const member = guild.member(newUser);

    // Check that member is in guild and is verified
    if (!member || !member.roles.cache.has(roles.verified)) return;

    // Check that the change was the username
    if (oldUser.tag === newUser.tag) return;

    // Add username to database
    const { addUsername } = require('../database/interface.js');
    addUsername(newUser);
}
