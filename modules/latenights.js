const CronJob = require('cron').CronJob;
const { categories, roles } = require('../config.json');
const { latenights } = require('../extraConfig.json');
var jobs = {};

module.exports = {
    setup: (guild) => {
        // Check for existing jobs
        if (jobs.show) return;

        // Instantiate jobs
        jobs.show = show(guild);
        jobs.hide = hide(guild);

        // Start jobs
        console.log('Starting late night cron jobs');
        jobs.show.start();
        jobs.hide.start();
    }
};

// Show late night channels, function returns cron job
function show(guild) {
    const H = latenights.start.split(':')[0];
    const i = latenights.start.split(':')[1];

    // Make cron job to set up channels and return job for main to run
    return new CronJob(`00 ${i} ${H} * * *`, async () => {
        // Edit the guild icon
        await guild.setIcon('./static/cursed_logo.png').catch(console.error);

        // Add wenkiss emoji
        await guild.emojis.create('./static/wenkiss.png', 'wenkiss').catch(console.error);

        // Un-verify Melody
        const nut = guild.members.cache.find(member => member.user.tag === 'nut#3000');
        const nutcam = guild.members.cache.find(member => member.user.tag === 'nutcam#7808');
        await nut.roles.remove(roles.verified).catch(console.error);
        await nutcam.roles.remove(roles.verified).catch(console.error);

        // Log cron job firing
        console.log('Showing late night channels...');

        const category = guild.channels.cache.get(latenights.id);
        const permsTable = [];

        try {
            // Move category into position
            await category.setPosition(1);

            // Allow verified members to access channels
            await category.updateOverwrite(roles.verified, {
                VIEW_CHANNEL:  true,
                SEND_MESSAGES: true,
                CONNECT:       true
            });

            // Log the perms for category for debugging
            permsTable.push(getPerms(category, roles.verified));

            // Sync permissions for all channels
            for (const channel of category.children.values()) {
                // Only sync if necessary
                if (!channel.permissionsLocked) {
                    console.log('Syncing perms for', channel.name);
                    await channel.lockPermissions();
                }

                // Log the perms for each channel for debugging
                permsTable.push(getPerms(channel, roles.verified));
            }

            // Log perms to console
            console.table(permsTable);
        } catch (error) {
            console.error("Couldn't show 'late nights':", error);
        }
    });
}

// Hide late night channels, function returns cron job
function hide(guild) {
    const H = latenights.end.split(':')[0];
    const i = latenights.end.split(':')[1];

    // Make new cron job to pack down channels and return job for main to run
    return new CronJob(`00 ${i} ${H} * * *`, async () => {
        // Edit the guild icon
        await guild.setIcon('./static/lofi_girl.gif').catch(console.error);

        // Remove wenkiss emoji
        const wenkiss = guild.emojis.cache.find(emoji => emoji.name === 'wenkiss');
        await wenkiss.delete().catch(console.error);

        // Re-verify Melody
        const nut = guild.members.cache.find(member => member.user.tag === 'nut#3000');
        const nutcam = guild.members.cache.find(member => member.user.tag === 'nutcam#7808');
        await nut.roles.add(roles.verified).catch(console.error);
        await nutcam.roles.add(roles.verified).catch(console.error);

        // Log cron job firing
        console.log('Hiding late night channels...');

        const category = guild.channels.cache.get(latenights.id);
        const position = guild.channels.cache.get(categories.archive).position + 1;
        const permsTable = [];

        try {
            // Remove verified members permissions
            await category.updateOverwrite(roles.verified, {
                VIEW_CHANNEL:  false,
                SEND_MESSAGES: false,
                CONNECT:       false
            });

            // Hide channels from everyone
            await category.updateOverwrite(guild.id, {
                VIEW_CHANNEL: false
            });

            // Log the perms for category for debugging
            permsTable.push(getPerms(category, roles.verified));

            // Sync permissions for all channels
            for (const channel of category.children.values()) {
                // Only sync if necessary
                if (!channel.permissionsLocked) {
                    console.log('Syncing perms for', channel.name);
                    await channel.lockPermissions();
                }

                // Log the perms for each channel for debugging
                permsTable.push(getPerms(channel, roles.verified));
            }

            // Move category into position
            await category.setPosition(position);

            // Log perms to console
            console.table(permsTable);
        } catch (error) {
            console.error("Couldn't hide 'late nights':", error);
        }
    });
}

function getPerms(channel, role) {
    const perms = channel.permissionsFor(role).serialize(true);
    return {
        channel:       channel.name,
        VIEW_CHANNEL:  perms.VIEW_CHANNEL,
        SEND_MESSAGES: perms.SEND_MESSAGES,
        CONNECT:       perms.CONNECT
    };
}
