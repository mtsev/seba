const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, server, channels, roles } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Read all command files in commands directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Initialisation sequence
var guild;
client.on('ready', () => {
    let d = new Date();
    console.log(`[${d.toLocaleString()}] Logged in as ${client.user.tag}!`);
    guild = client.guilds.get(server.id);
});


// Welcome message for new members
client.on('guildMemberAdd', async member => {
    const message = `Welcome to ${server.name}, ${member}! ` +
            `Please read the <#${channels.rules}> and verify yourself to start chatting.`;
    await client.channels.get(channels.welcome).send(message);
});


// Bot commands
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
        const member = guild.members.get(message.author.id);
        if (!member.roles.has(roles.exec)) {
            let d = new Date();
            console.log(`[${d.toLocaleString()}] Unauthorised user '${member.user.tag}' tried to use '${commandName}'`);
            return;
        }
    }
    
    // Execute command
    try {
        await command.execute(guild, message, args);
    } catch (error) {
        console.error(error);
        await message.reply("sorry, an error has occurred. " +
            "Please try again or ping an @exec if the problem doesn't go away.");
    }
    
});

// Log onto Discord
client.login(token);
