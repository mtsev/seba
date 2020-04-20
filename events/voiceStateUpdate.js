const { server } = require('../config.json');

// Export event so it can be used
module.exports = async (client, oldMember, newMember) => {

    // Bonus features
    if (client.bonus) {

        // Gaming mode
        const { lounge } = require('../bonusConfig.json');
        await gamingMode(lounge.id, oldMember, newMember);
    }
}

// Toggle game mode for lounge
async function gamingMode(loungeID, oldMember, newMember) {

    // Load gaming module
    const { setGameMode, setNormalMode } = require('../modules/gaming.js')

    // Get guild
    const guild = oldMember.client.guilds.get(server.id);

    // Get the lounge channel
    const lounge = guild.channels.get(loungeID);

    // Check if lounge was in old or new state
    const oldLounge = (oldMember.voiceChannel === lounge);
    const newLounge = (newMember.voiceChannel === lounge);

    // case: member joins the lounge
    if (!oldLounge && newLounge) {
        setGameMode(lounge, newMember);
    }

    // case: member leaves the lounge
    else if (oldLounge && !newLounge) {
        setNormalMode(lounge);
    }
}
