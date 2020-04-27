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
            
            // Sync permissions for all channels
            category.children.forEach(async channel => {
                await channel.lockPermissions();
            });


            console.log('Late night channels now open');

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

            // Sync permissions for all channels
            category.children.forEach(async channel => {
                await channel.lockPermissions();
            });

            // Move category into position
            await category.setPosition(position);

            console.log('Goodbye late night channels');

        } catch (error) {
            console.error(`Couldn't hide 'late nights':`, error);
        }
    });
}
