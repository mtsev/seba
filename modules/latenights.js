const CronJob = require('cron').CronJob;
const { categories, roles } = require('../config.json');
const { latenights } = require('../bonusConfig.json');

module.exports = {
    showLateNights: showLateNights,
    hideLateNights: hideLateNights,
};

// Show late night channels from 00:00, function returns cronjob
function showLateNights(guild) {

    // Make cron job to set up channels and return job for main to run
    return new CronJob('00 00 00 * * *', async () => {

        const lateNights = guild.channels.get(latenights);

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
            let d = new Date();
            console.error(`[${d.toLocaleString()}] Couldn't show 'late nights':`, error);
        }
    });
}

// Hide late night channels after 06:00, function returns cronjob
function hideLateNights(guild) {

    // Make new cron job to pack down channels and return job for main to run
    return new CronJob('00 00 06 * * *', async () => {

        const lateNights = guild.channels.get(latenights);
        const position = guild.channels.get(categories.exec).position + 1;

        try {

            // Remove access from members
            await lateNights.overwritePermissions(guild.roles.get(roles.verified), {
                VIEW_CHANNEL: false,
                SEND_MESSAGES: false,
                CONNECT: false
            });

            // Sync permissions for all channels
            lateNights.children.forEach(async channel => {
                await channel.lockPermissions();
            });

            // Move category back down
            await lateNights.setPosition(position);

        } catch (error) {
            let d = new Date();
            console.error(`[${d.toLocaleString()}] Couldn't hide 'late nights':`, error);
        }
    });
}
