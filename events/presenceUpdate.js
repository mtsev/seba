const { server } = require('../config.json');

// Export event so it can be used
module.exports = async (client, oldMember, newMember) => {

    // Extra features
    if (client.extra) {

        // Gaming mode
        const { lounge } = require('../extraConfig.json');
        await gamingMode(lounge.id, oldMember, newMember);
    }
}

// Toggle game mode for lounge
async function gamingMode(loungeID, oldMember, newMember) {

    // Load from gaming module
    const { inGame, setGameMode, setNormalMode } = require('../modules/gaming.js')

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
        setGameMode(lounge, newMember);
    }

    // case: member stops playing league
    else if (oldLeague && !newLeague) {
        setNormalMode(lounge);
    }
}
