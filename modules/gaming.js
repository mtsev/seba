const { lounge } = require('../extraConfig.json');

module.exports = {
    inGame: inGame,
    setGameMode: setGameMode,
    setNormalMode: setNormalMode,
};

function inGame(member) {
    let status = false;
    member.presence.activities.forEach(game => {
        if (game.name === lounge.game) {
            status = true;
            return;
        }
    });
    return status;
}

async function setGameMode(channel, member) {
    // Get guild
    const guild = channel.guild;

    // If the member isn't playing game, we can ignore
    if (!inGame(member)) return;

    // If the lounge is already game mode, we can ignore
    if (channel.name === lounge.gameMode) return;

    // Set name to game mode
    await channel.setName(lounge.gameMode).catch(console.error);

    // Open access to everyone
    await channel.overwritePermissions(guild.roles.get(guild.id), {
        CONNECT: true,
        SPEAK: true
    }).catch(console.error);

    console.log(`We're in game mode now`);
}

async function setNormalMode(channel) {

    // if the lounge isn't game mode, we can ignore
    if (channel.name !== lounge.gameMode) return;

    // check if anyone is still playing game in the lounge
    let stillPlaying = false;
    for (member in channel.members) {
        if (inGame(member)) {
            stillPlaying = true;
            return;
        }
    }

    // if no one is playing game anymore, revert to regular lounge
    if (!stillPlaying) {
        await channel.setName(lounge.normalMode).catch(console.error);
        await channel.lockPermissions().catch(console.error);
        console.log(`Back to regular lounge`);
    }
}
