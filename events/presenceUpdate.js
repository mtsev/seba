const { server } = require('../config.json');

// Export event so it can be used
module.exports = async (client, oldMember, newMember) => {

    // Bonus features
    if (client.bonus) {

        // League mode
        const { lounge } = require('../bonusConfig.json');
        await leagueMode(lounge, oldMember, newMember);
    }
}

// Toggle league mode for lounge
async function leagueMode(loungeID, oldMember, newMember) {

    // Load from league module
    const { inGame, setLeague, setRegular } = require('../modules/league.js')

    // Get guild
    const guild = oldMember.client.guilds.get(server.id);

    // Get the lounge channel
    const lounge = guild.channels.get(loungeID);

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
