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

    // Check that the member is in lounge
    if (!lounge.members.find(member => member.id === newMember.id)) return;

    // Check if league is in old presence
    let oldLeague = false;
    oldMember.presence.activities.forEach(game => {
        if (game.name === league) {
            oldLeague = true;
            return;
        };
    });

    // Check if league is in new presence
    let newLeague = false;
    newMember.presence.activities.forEach(game => {
        if (game.name === league) {
            newLeague = true;
            return;
        }
    });

    // case: member starts playing league
    if (!oldLeague && newLeague) {

        // if the lounge is already league, we can ignore
        if (lounge.name === legend) return;

        // Set name to league
        await lounge.setName(legend).catch(console.error);

        // Open access to everyone
        await lounge.overwritePermissions(guild.roles.get(guild.id), {
            CONNECT: true,
            SPEAK: true
        }).catch(console.error);

        console.log(`[${new Date().toLocaleString()}] we league now`);
    }

    // case: member stops playing league
    else if (oldLeague && !newLeague) {

        // check if anyone is still playing league in the lounge
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