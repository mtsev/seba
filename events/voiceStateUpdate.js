// Export event so it can be used
module.exports = async (client, oldState, newState) => {
    if (client.extra) {
        gamingMode(oldState, newState);
    }
};

// Toggle game mode for lounge
function gamingMode(oldState, newState) {
    const { lounge } = require('../extraConfig.json');
    const { setGameMode, setNormalMode } = require('../modules/gaming.js');

    // Check if lounge was in old or new state
    const oldLounge = (oldState.channelID === lounge.id);
    const newLounge = (newState.channelID === lounge.id);

    // member joins the lounge
    if (!oldLounge && newLounge) {
        console.log(`voiceStateUpdate: ${newState.member.user.tag} joined lounge`);
        setGameMode(newState.channel, newState.member);
    }

    // member leaves the lounge
    else if (oldLounge && !newLounge) {
        console.log(`voiceStateUpdate: ${newState.member.user.tag} left lounge`);
        setNormalMode(oldState.channel);
    }
}
