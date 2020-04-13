const Discord = require('discord.js');
const { token, server, channels } = require('./config.json');

const league = 'League of Legends';
const legend = 'Lounge of Legends';
const regular = 'lounge';

var guild;
var lounge;

const client = new Discord.Client();

/* Log in */
client.login(token);

/* Initialisation sequence */
client.on('ready', () => {
    // Log init to console
    console.log(`[${new Date().toLocaleString()}] Lounge of Legends is active!`);

    // Get guild
    guild = client.guilds.get(server.id);

    // Get the lounge channel
    lounge = guild.channels.get(channels.lounge);
});

/* Lounge of Legends on presence change */
client.on('presenceUpdate', async (oldMember, newMember) => {

    // Check that the member is in lounge
    if (!lounge.members.find(member => member.id === newMember.id)) return;

    // Check if league is in old presence
    let oldLeague = false;
    oldMember.presence.activities.forEach(game => {
        if (game.name === league) {
            oldLeague = true;
            return;
        };
    });

    // Check if league is in new presence
    let newLeague = false;
    newMember.presence.activities.forEach(game => {
        if (game.name === league) {
            newLeague = true;
            return;
        }
    });

    // case: member starts playing league
    if (!oldLeague && newLeague) {

        // if the lounge name isn't already set, then set it
        if (lounge.name !== legend) {
            await lounge.setName(legend).catch(console.error);
            console.log(`[${new Date().toLocaleString()}] we league now`);
        } 
    }

    // case: member stops playing league
    else if (oldLeague && !newLeague) {

        let stillPlaying = false;
        
        // check if anyone is still playing league in the lounge
        lounge.members.forEach(member => {
            member.presence.activities.forEach(game => {
                if (game.name === league) {
                    stillPlaying = true;
                    return;
                }
            });

            // already found member who is playing, no need to check more
            if (stillPlaying) return;
        });

        // if no one is playing league anymore, revert name to regular lounge
        if (!stillPlaying) {
            await lounge.setName(regular).catch(console.error);
            console.log(`[${new Date().toLocaleString()}] back to regular lounge`);
        }
    }
});

/* Lounge of Legends on joining or leaving lounge */
client.on('voiceStateUpdate', async (oldMember, newMember) => {

    // Check if lounge was in old or new state
    const oldLounge = (oldMember.voiceChannel === lounge);
    const newLounge = (newMember.voiceChannel === lounge);

    // case: member joins the lounge
    if (!oldLounge && newLounge) {

        // if the lounge is already league, we can ignore
        if (lounge.name === legend) return;

        // otherwise set the lounge name if member is playing
        newMember.presence.activities.forEach(async game => {
            if (game.name === league) {
                await lounge.setName(legend).catch(console.error);
                console.log(`[${new Date().toLocaleString()}] we league now`);
            }
        });
    }

    // case: member leaves the lounge
    else if (oldLounge && !newLounge) {
        console.log(oldMember.user.tag,'left :(');

        // if the lounge isn't league, we can ignore
        if (lounge.name !== legend) return;

        // otherwise check if anyone is still playing
        let stillPlaying = false;
        lounge.members.forEach(member => {
            member.presence.activities.forEach(game => {
                if (game.name === league) {
                    stillPlaying = true;
                    return;
                }
            });

            // already found member who is playing, no need to check more
            if (stillPlaying) return;
        });

        // if no one is playing league anymore, revert name to regular lounge
        if (!stillPlaying) {
            await lounge.setName(regular).catch(console.error);
            console.log(`[${new Date().toLocaleString()}] back to regular lounge`);
        }
    }
});
