const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, server, channels } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Read all command files in commands directory
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// Output to console on successful login
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


// Welcome message for new members
client.on('guildMemberAdd', async member => {
    const message = `Welcome to ${server.name}, ${member}! ` +
            `Please read the <#${channels.rules}> and verify yourself to start chatting.`;
    await client.channels.get(channels.welcome).send(message);
});


// Bot commands
client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        await command.execute(client, message, args);
    } catch (error) {
        console.error(error);
        await message.reply("Sorry, an error has occurred. " +
            "Please try again or ping an @exec if the problem doesn't go away.");
    }
    
});

// Log onto Discord
client.login(token);
