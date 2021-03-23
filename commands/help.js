const { prefix } = require('../config.json');

// Export command so it can be used
module.exports = {
    name:        'help',
    aliases:     ['commands'],
    description: 'Show this message. Can be used in any channel or DM.',
    usage:       '[command name]',
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
        const command = commands.get(name) ||
            commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));

        if (!command) {
            return message.channel.send(`No command called \`${name}\` found.`);
        }

        data.push('```');
        if (command.name !== name) {
            data.push(`(Alias for '${command.name}')\n`);
        }
        if (command.usage) {
            data.push(`${customPrefix}${command.name} ${command.usage}\n`);
        }
        if (command.privileged) {
            data.push('Can only be used by exec.\n');
        }
        if (command.description) {
            data.push(command.description);
        }
        // We want 'verify' to accept default prefix since that's hardcoded
        // in the email sent by the google form.
        if (!command.name === 'verify') {
            data.push(`\nCan be called with '${prefix}verify' ` +
                      'regardless of prefix setting.');
        }
        data.push('```');
    }

    // Send help message
    await message.channel.send(data).catch(console.error);
}
