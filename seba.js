const fs = require('fs');
const Discord = require('discord.js');
const { token } = require('./config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();
client.bonus = fs.existsSync('./bonusConfig.json');
client.database = fs.existsSync('./database/dbConfig.json');

/* Output to client if bonus features are enabled */
if (client.bonus) console.log("Bonus features have been enabled.\n");

/* Load and bind all events */
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
}

/* Read all command files in commands directory */
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

/* Log onto Discord */
client.login(token);
