module.exports = {
    inGame: inGame,
    setLeague: setLeague,
    setRegular: setRegular,
};

const league = 'League of Legends';
const legend = 'Lounge of Legends';
const regular = 'lounge';

function inGame(member) {
    let status = false;
    member.presence.activities.forEach(game => {
        if (game.name === league) {
            status = true;
            return;
        }
    });
    return status;
}

async function setLeague(lounge, member) {
    // Get guild
    const guild = lounge.guild;

    // If the member isn't playing league, we can ignore
    if (!inGame(member)) return;

    // If the lounge is already league, we can ignore
    if (lounge.name === legend) return;

    // Set name to league
    await lounge.setName(legend).catch(console.error);

    // Open access to everyone
    await lounge.overwritePermissions(guild.roles.get(guild.id), {
        CONNECT: true,
        SPEAK: true
    }).catch(console.error);

    console.log(`[${new Date().toLocaleString()}] We're in league mode now`);
}

async function setRegular(lounge) {

    // if the lounge isn't league, we can ignore
    if (lounge.name !== legend) return;

    // check if anyone is still playing league in the lounge
    let stillPlaying = false;
    for (member in lounge.members) {
        if (inGame(member)) {
            stillPlaying = true;
            return;
        }
    }

    // if no one is playing league anymore, revert to regular lounge
    if (!stillPlaying) {
        await lounge.setName(regular).catch(console.error);
        await lounge.lockPermissions().catch(console.error);
        console.log(`[${new Date().toLocaleString()}] Back to regular lounge`);
    }
}