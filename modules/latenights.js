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

// Show late night channels from 00:00, function returns cronjob
function show(guild) {

    let H = latenights.start.split(':')[0];
    let i = latenights.start.split(':')[1];

    // Make cron job to set up channels and return job for main to run
    return new CronJob(`00 ${i} ${H} * * *`, async () => {

        const category = guild.channels.get(latenights.id);

        try {
            // Move category into position
            await category.setPosition(2);

            // Allow verified members to access channels
            await category.overwritePermissions(guild.roles.get(roles.verified), {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                CONNECT: true
            });

            // Log the perms for category for debugging
            let perms = category.permissionsFor(roles.verified).serialize(true);
            let permsTable = [];
            permsTable.push({ 
                channel: category.name,
                VIEW_CHANNEL: perms.VIEW_CHANNEL,
                SEND_MESSAGES: perms.SEND_MESSAGES,
                CONNECT: perms.CONNECT
            });
            
            // Sync permissions for all channels
            for (let channel of category.children.values()) {

                // Only sync if necessary
                if (!channel.permissionsLocked) {
                    console.log('Syncing perms for', channel.name);
                    await channel.lockPermissions();
                }

                // Log the perms for each channel for debugging
                perms = channel.permissionsFor(roles.verified).serialize(true);
                permsTable.push({ 
                    channel: channel.name,
                    VIEW_CHANNEL: perms.VIEW_CHANNEL,
                    SEND_MESSAGES: perms.SEND_MESSAGES,
                    CONNECT: perms.CONNECT
                });
            }

            // Log perms table
            console.table(permsTable);

            console.log('Late night channels now open');

        } catch (error) {
            console.error(`Couldn't show 'late nights':`, error);
        }
    });
}

// Hide late night channels after 06:00, function returns cronjob
function hide(guild) {

    let H = latenights.end.split(':')[0];
    let i = latenights.end.split(':')[1];

    // Make new cron job to pack down channels and return job for main to run
    return new CronJob(`00 ${i} ${H} * * *`, async () => {

        const category = guild.channels.get(latenights.id);
        const position = guild.channels.get(categories.exec).position + 1;

        try {

            // Remove verified members permissions
            await category.overwritePermissions(guild.roles.get(roles.verified), {
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
                CONNECT: false
            });

            // Hide channels from everyone
            await category.overwritePermissions(guild.defaultRole, {
                VIEW_CHANNEL: false
            });

            // Log the perms for category for debugging
            let perms = category.permissionsFor(roles.verified).serialize(true);
            let permsTable = [];
            permsTable.push({ 
                channel: category.name,
                VIEW_CHANNEL: perms.VIEW_CHANNEL,
                SEND_MESSAGES: perms.SEND_MESSAGES,
                CONNECT: perms.CONNECT
            });
            
            // Sync permissions for all channels
            for (let channel of category.children.values()) {

                // Only sync if necessary
                if (!channel.permissionsLocked) {
                    console.log('Syncing perms for', channel.name);
                    await channel.lockPermissions();
                }

                // Log the perms for each channel for debugging
                perms = channel.permissionsFor(roles.verified).serialize(true);
                permsTable.push({ 
                    channel: channel.name,
                    VIEW_CHANNEL: perms.VIEW_CHANNEL,
                    SEND_MESSAGES: perms.SEND_MESSAGES,
                    CONNECT: perms.CONNECT
                });
            }

            // Log perms table
            console.table(permsTable);

            // Move category into position
            await category.setPosition(position);

            console.log('Goodbye late night channels');

        } catch (error) {
            console.error(`Couldn't hide 'late nights':`, error);
        }
    });
}
