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

    // Load league module
    const { setLeague, setRegular } = require('../modules/league.js')

    // Get guild
    const guild = oldMember.client.guilds.get(server.id);

    // Get the lounge channel
    const lounge = guild.channels.get(loungeID);

    // Check if lounge was in old or new state
    const oldLounge = (oldMember.voiceChannel === lounge);
    const newLounge = (newMember.voiceChannel === lounge);

    // case: member joins the lounge
    if (!oldLounge && newLounge) {
        setLeague(lounge, newMember);
    }

    // case: member leaves the lounge
    else if (oldLounge && !newLounge) {
        setRegular(lounge);
    }
}
