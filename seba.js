const Discord = require('discord.js');
const client = new Discord.Client();
const { token, welcome_ch, rules_ch, intro_ch } = require('./config.json');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildMemberAdd', member => {
    var message = `Welcome to UNSW lo-fi society, ${member}! Please read the <#${rules_ch}> and introduce yourself in <#${intro_ch}>.`
    client.channels.get(welcome_ch).send(message);
});

client.login(token);