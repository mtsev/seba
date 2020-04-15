const fs = require('fs');
const Discord = require('discord.js');
const { token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

console.log(`[${new Date().toLocaleString()}] !!! Test mode activated !!!`);


/* Load all events */
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    try {
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind());
        console.log(`[${new Date().toLocaleString()}] Loaded event '${eventName}'`);
    } catch(error) {
        console.error(`[${new Date().toLocaleString()}] Error loading event '${file}':`, error);
    }
}

/* Commands to be tested are passed in as arguments */
const commandFiles = process.argv.slice(2);

/* Import all commands to be tested */
for (const file of commandFiles) {
    try {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
        console.log(`[${new Date().toLocaleString()}] Loaded command '${command.name}'`);
    } catch(error) {
        console.error(`[${new Date().toLocaleString()}] Error loading command '${file}':`, error);
    }
}

/* Warn if no commands were loaded */
if (!client.commands.size) {
    console.log(`[${new Date().toLocaleString()}] Warning: no commands were loaded.`);
}

/* Initialisation sequence */
client.on('ready', () => {
    console.log(`[${new Date().toLocaleString()}] Logged in as ${client.user.tag}`);
});

/* Log onto Discord */
client.login(token);
