const fs = require('fs');
const mysql = require('mysql');
const Discord = require('discord.js');
const { token } = require('./config.json');

/* Format console.log */
require('./modules/logging.js');

/* Initialise client */
const client = new Discord.Client();
client.commands = new Discord.Collection();

/* Extra features enabled */
if (fs.existsSync('./database/dbConfig.json')) {
    console.log('Extra features enabled.');
    client.extra = true;
}

/* Database enabled, make global connection object */
if (fs.existsSync('./database/dbConfig.json')) {
    const db = require('./database/dbConfig.json');
    client.database = mysql.createConnection({
        host     : db.host,
        port     : db.port,
        user     : db.user,
        password : db.password,
        database : db.database,
        charset : 'utf8mb4'
    });
    console.log('Database features enabled.');
}

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

/* Graceful shutdown */
const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
sigs.forEach(sig => {
    process.on(sig, function () {
        console.log();
        console.log(`${sig} signal received`);
        shutdown();
    });
});

/* Handle shutdown */
var shutdown = function () {
    function logout() {
        console.log(`Logging out ${client.user.tag}...`);
        client.destroy();
        console.log('Goodbye!\n');
        process.exit();
    }

    // Database enabled
    if (client.database) {
        client.database.end( () => {
            console.log('MySQL connection closed');
            logout();
        });
    } else {
        logout();
    }
}
