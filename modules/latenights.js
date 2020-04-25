const CronJob = require('cron').CronJob;
const { categories, roles } = require('../config.json');
const { latenights } = require('../extraConfig.json');

module.exports = {
    showLateNights: showLateNights,
    hideLateNights: hideLateNights,
};

// Show late night channels from 00:00, function returns cronjob
function showLateNights(guild) {

    let H = latenights.start.split(':')[0];
    let i = latenights.start.split(':')[1];

    // Make cron job to set up channels and return job for main to run
    return new CronJob(`00 ${i} ${H} * * *`, async () => {

        const lateNights = guild.channels.get(latenights.id);

        try {
            // Move category into position
            await lateNights.setPosition(2);

            // Give access to members
            await lateNights.overwritePermissions(guild.roles.get(roles.verified), {
                VIEW_CHANNEL: true,
                SEND_MESSAGES: true,
                CONNECT: true
            });

            // Sync permissions for all channels
            lateNights.children.forEach(async channel => {
                await channel.lockPermissions();
            });

        } catch (error) {
            console.error(`Couldn't show 'late nights':`, error);
        }
    });
}

// Hide late night channels after 06:00, function returns cronjob
function hideLateNights(guild) {

    let H = latenights.end.split(':')[0];
    let i = latenights.end.split(':')[1];

    // Make new cron job to pack down channels and return job for main to run
    return new CronJob(`00 ${i} ${H} * * *`, async () => {

        const lateNights = guild.channels.get(latenights.id);
        const position = guild.channels.get(categories.exec).position + 1;

        try {

            // Remove access from members
            await lateNights.overwritePermissions(guild.roles.get(roles.verified), {
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
                CONNECT: false
            });

            // Remove access from everyone in case it was manually given with '!show'
            await lateNights.overwritePermissions(guild.roles.get(guild.id), {
                VIEW_CHANNEL: false
            });

            // Sync permissions for all channels
            lateNights.children.forEach(async channel => {
                await channel.lockPermissions();
            });

            // Move category back down
            await lateNights.setPosition(position);

        } catch (error) {
            console.error(`Couldn't hide 'late nights':`, error);
        }
    });
}
