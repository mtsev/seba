#!/usr/bin/env node
const fs = require('fs');
const Discord = require('discord.js');
const { token, prefix } = require('./config.json');

/* Format console.log */
require('./modules/logging.js');

/* Initialise client */
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.prefix = prefix;

/* Set optional features */
client.extra = fs.existsSync('./extraConfig.json');
client.database = fs.existsSync('./database/dbConfig.json');

/* Output to console if any optional features are enabled */
if (client.extra) console.log('Extra features enabled');
if (client.database) console.log('Database features enabled');

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

/* Track any unhandled rejections */
process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});

/* Graceful shutdown */
const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
sigs.forEach(sig => {
    process.on(sig, () => {
        console.log(`${sig} signal received`);
        shutdown();
    });
});

/* Handle shutdown */
function shutdown () {
    var logout = async function () {
        console.log(`Logging out ${client.user.tag}...`);
        await client.destroy();
        console.log('Goodbye!\n');
        process.exit();
    }

    // Database enabled
    if (client.database) {
        const { closeDatabase } = require('./database/interface.js');
        closeDatabase(logout);
    } else {
        logout();
    }
}
