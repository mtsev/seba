const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token, channels } = require('./config.json');
const { getPad } = require('./random.js');

// Output to console on successful login
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});


// Welcome message for new members
client.on('guildMemberAdd', member => {
    var message = `Welcome to UNSW lo-fi society, ${member}! \
            Before you can talk in the server, you will have to verify yourself. \
            Please read the <#${channels.rules}> for instructions \
            and introduce yourself in <#${channels.intro}> once you're done!`
    client.channels.get(channels.welcome).send(message);
});


// Bot command for verification
client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'verify') {

        var botReply;
        var member = message.member;

        // Ignore messages outside of DM or verification channel
        if (message.guild != null && message.channel.id != channels.verify) return;

        // Invalid code entered
        if (!args.match(/[\d]{6}/)) {
            botReply = "Please enter a valid verification code. It should be in this format:\n" + 
                    "`!verify xxxxxx`";
        }

        // Verification successful
        else if (args == getPad(member.user.tag, 6)) {
            botReply = "Congratulations, you have been successfully verified. " +
                    "Welcome to **lo-fi society**! You may now chat in the server.";
            
            // Add verified role to member
            let role = message.guild.roles.find(r => r.name === "verified");
            member.addRole(role).catch(console.error);
        }

        // Incorrect code entered
        else {
            botReply = "**Sorry, your verification code was incorrect. Please try the following:**\n" +
                    "1. Check that the code was entered correctly and try again.\n" +
                    "2. Check that your Discord tag is the same as what you entered into the form and try again.\n" +
                    "3. Ping an @exec in the #verification channel or email us at unswlofisoc@gmail.com if it's still not working.";
        }

        // Send message to member
        member.send(botReply);
    }
    
});

client.login(token);

console.log(getPad("NaCl#9482",6));
