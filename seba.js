const fs = require('fs');
const CronJob = require('cron').CronJob;
const Discord = require('discord.js');
const { prefix, token, server, categories, channels, roles } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

/* Read all command files in commands directory */
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

/* Initialisation sequence */
var guild;
client.on('ready', () => {
    // Log init to console
    let d = new Date();
    console.log(`[${d.toLocaleString()}] Logged in as ${client.user.tag}!`);

    // Get guild
    guild = client.guilds.get(server.id);

    // Start late night cron jobs
    showLateNights.start();
    hideLateNights.start();
});


/* Late night channels active 01:00 - 06:00 */
const showLateNights = new CronJob('00 00 01 * * *', async () => {
    const lateNights = await guild.channels.get(categories.lateNights);
    let d = new Date();

    // Move category into position
    await lateNights.setPosition(2)
                .then(newChannel => console.log(`${lateNights.name}'s new position is ${newChannel.position}`))
                .catch(console.error);

    // Give access to members
    await lateNights.overwritePermissions(guild.roles.get(roles.verified), {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        CONNECT: true
    })
        .then(() => console.log(`[${d.toLocaleString()}] Late nights hours are now in session`))
        .catch(console.error);
});

const hideLateNights = new CronJob('00 00 06 * * *', async () => {
    const lateNights = await guild.channels.get(categories.lateNights);
    const position = await guild.channels.get(categories.exec).position + 1;
    let d = new Date();

    // Move category back down
    await lateNights.setPosition(position)
                .then(newChannel => console.log(`${lateNights.name}'s new position is ${newChannel.position}`))
                .catch(console.error);

    // Remove access from members
	await lateNights.overwritePermissions(guild.roles.get(roles.verified), {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false,
        CONNECT: false
    })
        .then(() => console.log(`[${d.toLocaleString()}] Rise with the moon go to bed with the sun`))
        .catch(console.error);
});


/* Welcome message for new members */
client.on('guildMemberAdd', async member => {
    const message = `Welcome to ${server.name}, ${member}! ` +
            `Please read the <#${channels.rules}> and verify yourself to start chatting.`;
    await client.channels.get(channels.welcome).send(message);
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

/* Log onto Discord */
client.login(token);
