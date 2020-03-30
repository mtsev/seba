const Discord = require('discord.js');
const client = new Discord.Client();
const CronJob = require('cron').CronJob;
const id = require('./config.json');

/* Ready message */
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

/* Welcome message on user join */
client.on('guildMemberAdd', member => {
    var message = `Welcome to UNSW lo-fi society, ${member}! Please read the <#${id.rules_ch}> and introduce yourself in <#${id.intro_ch}>.`
    client.channels.get(id.welcome_ch).send(message);
});

/* Late night voice channel active 01:00 - 06:00 */
const show_ln_chan = new CronJob('00 00 01 * * *', function() {
    client.channels.get(id.ln_cat).overwritePermissions(id.everyone, {
        'SEND_MESSAGES': true,
    })
});
const hide_ln_chan = new CronJob('00 00 06 * * *', function() {
	
});


client.login(id.token);
show_ln_chan.start();
hide_ln_chan.start()