const { prefix } = require('../config.json');

// Export command so it can be used
module.exports = {
    name:        'help',
    description: 'Show this message. Can be used in any channel or DM.',
    usage:       '[commands...]',
    privileged:  false,
    execute:     execute
};

// Actual command to execute
async function execute(guild, message, args) {
    const data = [];
    const { commands } = message.client;

    let customPrefix = message.client.prefix;
    if (/[a-zA-Z0-9]$/.test(message.client.prefix)) customPrefix += ' ';

    if (!args.length) {
        data.push('```');
        data.push('Available commands:\n');
        data.push(`${commands.map(command => command.name).join(', ')}`);
        data.push(`\nUse '${customPrefix}help <command>' ` +
                  'for info on a specific command.');
        data.push('```');
    }

    else {
        const name = args[0].toLowerCase();
        const command = commands.get(name);

        if (!command) {
            return message.reply(`No command called \`${name}\` found.`);
        }

        data.push('```');
        if (command.usage) {
            data.push(`${customPrefix}${command.name} ${command.usage}\n`);
        }
        if (command.privileged) {
            data.push('Can only be used by exec.\n');
        }
        if (command.description) {
            data.push(command.description);
        }
        if (!command.privileged) {
            data.push(`\nCan be called with '${prefix}${command.name}' ` +
                      'regardless of prefix setting.');
        }
        data.push('```');
    }

    // Send help message
    await message.channel.send(data).catch(console.error);
}
