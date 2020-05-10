// Export event so it can be used
module.exports = async (client, oldState, newState) => {

    // Extra features
    if (client.extra) {

        // Gaming mode
        gamingMode(oldState, newState);
    }
}

// Toggle game mode for lounge
function gamingMode(oldState, newState) {

    const { lounge } = require('../extraConfig.json');
    const { setGameMode, setNormalMode } = require('../modules/gaming.js')

    // Check if lounge was in old or new state
    const oldLounge = (oldState.channelID === lounge.id);
    const newLounge = (newState.channelID === lounge.id);

    // case: member joins the lounge
    if (!oldLounge && newLounge) {
        setGameMode(newState.channel, newState.member);
    }

    // case: member leaves the lounge
    else if (oldLounge && !newLounge) {
        setNormalMode(oldState.channel);
    }
}
