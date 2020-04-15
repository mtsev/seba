const { server, channels } = require('../config.json');

// Export event so it can be used
module.exports = async (client, oldMember, newMember) => {
    await leagueMode(oldMember, newMember);
}

// Toggle league mode for lounge
async function leagueMode(oldMember, newMember) {

    const league = 'League of Legends';
    const legend = 'Lounge of Legends';
    const regular = 'lounge';

    // Get guild
    const guild = oldMember.client.guilds.get(server.id);

    // Get the lounge channel
    const lounge = guild.channels.get(channels.lounge);

    // Check if lounge was in old or new state
    const oldLounge = (oldMember.voiceChannel === lounge);
    const newLounge = (newMember.voiceChannel === lounge);

    // case: member joins the lounge
    if (!oldLounge && newLounge) {

        // if the lounge is already league, we can ignore
        if (lounge.name === legend) return;

        // otherwise set to league mode if member is playing
        newMember.presence.activities.forEach(async game => {
            if (game.name === league) {
                
                // Set name to league
                await lounge.setName(legend).catch(console.error);

                // Open access to everyone
                await lounge.overwritePermissions(guild.roles.get(guild.id), {
                    CONNECT: true,
                    SPEAK: true
                }).catch(console.error);
                
                console.log(`[${new Date().toLocaleString()}] we league now`);
                return;
            }
        });
    }

    // case: member leaves the lounge
    else if (oldLounge && !newLounge) {

        // if the lounge isn't league, we can ignore
        if (lounge.name !== legend) return;

        // otherwise check if anyone is still playing
        let stillPlaying = false;
        lounge.members.forEach(member => {
            member.presence.activities.forEach(game => {
                if (game.name === league) {
                    stillPlaying = true;
                    return;
                }
            });

            // already found member who is playing, no need to check more
            if (stillPlaying) return;
        });

        // if no one is playing league anymore, revert to regular lounge
        if (!stillPlaying) {
            await lounge.setName(regular).catch(console.error);
            await lounge.lockPermissions().catch(console.error);
            console.log(`[${new Date().toLocaleString()}] back to regular lounge`);
        }
    }
}