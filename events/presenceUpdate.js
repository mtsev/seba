const { server, channels } = require('../config.json');
const { inGame, setLeague, setRegular } = require('../modules/league.js')

// Export event so it can be used
module.exports = async (client, oldMember, newMember) => {
    await leagueMode(oldMember, newMember);
}

// Toggle league mode for lounge
async function leagueMode(oldMember, newMember) {

    // Get guild
    const guild = oldMember.client.guilds.get(server.id);

    // Get the lounge channel
    const lounge = guild.channels.get(channels.lounge);

    // Check that the member is in lounge
    if (!lounge.members.find(member => member.id === newMember.id)) return;

    // Check if league is in old and new presence
    const oldLeague = inGame(oldMember);
    const newLeague = inGame(newMember);

    // case: member starts playing league
    if (!oldLeague && newLeague) {
        setLeague(lounge, newMember);
    }

    // case: member stops playing league
    else if (oldLeague && !newLeague) {
        setRegular(lounge);
    }
}