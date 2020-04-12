const Discord = require('discord.js');
const { showLateNights, hideLateNights } = require('./latenights.js');
const { prefix, token, server, roles } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

console.log(`[${new Date().toLocaleString()}] !!! Test mode activated !!!`);

/* Commands to be tested are passed in as arguments */
const commandFiles = process.argv.slice(2);

/* Import all commands to be tested */
for (const file of commandFiles) {
    try {
        const command = require(`./commands/${file}`);
        client.commands.set(command.name, command);
        console.log(`[${new Date().toLocaleString()}] Loaded command '${command.name}'`);
    } catch(error) {
        console.error(`[${new Date().toLocaleString()}] Error loading '${file}':`, error);
    }
}

/* Warn if no commands were loaded */
if (!client.commands.size) {
    console.log(`[${new Date().toLocaleString()}] Warning: no commands were loaded.`);
}

/* Initialisation sequence */
var guild;
client.on('ready', () => {
    // Log init to console
    console.log(`[${new Date().toLocaleString()}] Logged in as ${client.user.tag}`);

    // Get guild
    guild = client.guilds.get(server.id);

    // Start late night cron jobs
    showLateNights(guild).start();
    hideLateNights(guild).start();
});

/* Bot commands */
client.on('message', async message => {

    // Ignore non-commands and messages from bots
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Parse message
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);

    // Ignore invalid command
    if (!command) return;

    // Check for exec only commmands
    if (command.privileged) {
        const member = guild.member(message.author);
        if (!member.roles.has(roles.exec)) {
            console.log(`[${new Date().toLocaleString()}] Unauthorised user '${member.user.tag}' tried to use '${commandName}'`);
            return;
        }
    }
    
    // Execute command
    try {
        console.log(`[${new Date().toLocaleString()}] Testing command '${commandName}'...`);
        await command.execute(guild, message, args);
        console.log(`[${new Date().toLocaleString()}] Success!`);
    } catch (error) {
        console.error(`[${new Date().toLocaleString()}]`, error);
        await message.reply("Sorry, an error has occurred. " +
            "Please try again or ping an @exec if the problem doesn't go away.");
    }
});

/* Log onto Discord */
client.login(token);
