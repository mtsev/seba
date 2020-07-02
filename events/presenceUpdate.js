// Export event so it can be used
module.exports = async (client, oldPresence, newPresence) => {
    if (client.extra) {
        gamingMode(oldPresence, newPresence);
    }
};

// Toggle game mode for lounge
function gamingMode(oldPresence, newPresence) {
    const { lounge } = require('../extraConfig.json');
    const { inGame, setGameMode, setNormalMode } = require('../modules/gaming.js');

    // Check that the member is in lounge
    if (newPresence.member.voice.channelID !== lounge.id) return;
    const channel = newPresence.member.voice.channel;

    // Check if league is in old and new presence
    const oldLeague = inGame(oldPresence);
    const newLeague = inGame(newPresence);

    // case: member starts playing league
    if (!oldLeague && newLeague) {
        console.log(`presenceUpdate: ${newPresence.member.user.tag} started playing`);
        setGameMode(channel, newPresence.member);
    }

    // case: member stops playing league
    else if (oldLeague && !newLeague) {
        console.log(`presenceUpdate: ${newPresence.member.user.tag} stopped playing`);
        setNormalMode(channel);
    }
}
