const { categories } = require('../config.json');

// Export command so it can be used
module.exports = {
    name: 'help',
    description: 'Show this message. Can be used in any channel and DM.',
    usage: "[commands...]",
    privileged: true,
    execute: execute,
};

// Actual command to execute
async function execute(guild, message, args) {

    // Messages outside of DM or exec category are sent to DM
    const replyChannel = (message.channel.type !== 'text' 
        || message.channel.parentID !== categories.exec) ? message.author : message.channel;

    const data = [];
    const prefix = message.client.prefix;
    const { commands } = message.client;
    
    if (!args.length) {
        data.push(`Commands:  \`${commands.map(command => command.name).join('` `')}\``);
        data.push(`\nUse \`${prefix}help [command name]\` for info on a specific command.`);
    }

    else {
        const name = args[0].toLowerCase();
        const command = commands.get(name);

        if (!command) {
            return message.reply(`No command called \`${command.name}\` found.`);
        }

        data.push('```');
        if (command.usage) data.push(`${prefix}${command.name} ${command.usage}\n`);
        if (command.description) data.push(command.description);
        data.push('```');
    }


    // Send help message
    try {
        await replyChannel.send(data);
    } catch(error) {

        let errorMessage;

        // Cannot direct message member
        if (error.code === 50007) {
            errorMessage = "I couldn't send you a DM. Please go to 'Privacy Settings'" +
                "for this server and allow direct messages from server members.";
            console.error(`Couldn't DM user ${message.author.tag}`);
        }

        // Some other error has occurred
        else {
            errorMessage = 'sorry, an error has occurred.'
            console.error(error);
        }

        // Reply with error message
        await message.reply(errorMessage).catch(console.error);
    }
}
