const { server, channels, roles } = require('../config.json');

// Export event so it can be used
module.exports = async (client, member) => {
    await welcome(member);

    // Database features
    if (client.database) {

        // Check if member previously verified
        verified(member);
    }
}

// Send welcome message
async function welcome(member) {
    const message = `Welcome to ${server.name}, ${member}! ` +
            `Please read the <#${channels.rules}> and verify yourself to start chatting.`;
    await member.client.channels.get(channels.welcome).send(message);
}

// Persistent verification
async function verified(member) {

    const { isVerified, addUsername, getNames } = require('../database/interface.js');
    const user = member.user;

    var addRole = async function (isVerified) {
        if (!isVerified) return;

        // Give verified role to member
        console.log(`Giving role to previously verified member ${user.tag}`);
        await member.addRole(roles.verified).catch(console.error);

        // Add username to history if different from previous
        var addUser = function (history) {
            const last = history.sort((a, b) => b.name_id - a.name_id).shift();

            if (!last) {
                // This shouldn't happen since we only call this if isVerified() succeeds
                console.error(`No username history found for ${user.tag}`);
            }

            else if (last.username !== user.username 
                    || last.discriminator != user.discriminator) {
                addUsername(user);
            }
        }
        getNames(user, addUser);
    }

    // Lookup target member from database
    isVerified(user, addRole);
}