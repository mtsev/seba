const { server, channels } = require('../config.json');
const { setLeague, setRegular } = require('../modules/league.js')

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