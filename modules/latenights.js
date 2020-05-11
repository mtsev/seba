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

    let H = latenights.start.split(':')[0];
    let i = latenights.start.split(':')[1];

    // Make cron job to set up channels and return job for main to run
    return new CronJob(`00 ${i} ${H} * * *`, async () => {

        // Log cron job firing
        console.log("Showing late night channels...");
        
        const category = guild.channels.cache.get(latenights.id);
        let permsTable = [];

        try {
            // Move category into position
            await category.setPosition(1);

            // Allow verified members to access channels
            await category.updateOverwrite(roles.verified, {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                CONNECT: true
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

    let H = latenights.end.split(':')[0];
    let i = latenights.end.split(':')[1];

    // Make new cron job to pack down channels and return job for main to run
    return new CronJob(`00 ${i} ${H} * * *`, async () => {

        // Log cron job firing
        console.log("Hiding late night channels...");

        const category = guild.channels.cache.get(latenights.id);
        const position = guild.channels.cache.get(categories.exec).position + 1;
        const permsTable = [];

        try {

            // Remove verified members permissions
            await category.updateOverwrite(roles.verified, {
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
                CONNECT: false
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
        channel: channel.name,
        VIEW_CHANNEL: perms.VIEW_CHANNEL,
        SEND_MESSAGES: perms.SEND_MESSAGES,
        CONNECT: perms.CONNECT
    };
}
