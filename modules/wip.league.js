const { server, channels } = require('../config.json');

module.exports = {
    inLeagueMode: inLeagueMode,
    inGame: inGame,
    setLeague: setLeague,
    setRegular: setRegular,
};

const league = 'League of Legends';
const legend = 'Lounge of Legends';
const regular = 'lounge';

// Get guild
const guild = oldMember.client.guilds.get(server.id);

// Get the lounge channel
const lounge = guild.channels.get(channels.lounge);

function inLeagueMode() {
    return lounge.name === legend;
}

function inGame(member) {
    for (game in member.presence.activities) {
        if (game.name === league) return true;
    }
    return false;
}

async function setLeague() {
    // Set name to league
    await lounge.setName(legend).catch(console.error);

    // Open access to everyone
    await lounge.overwritePermissions(guild.roles.get(guild.id), {
        CONNECT: true,
        SPEAK: true
    }).catch(console.error);
}