# seba
Discord bot for UNSW lo-fi society's Discord server. 

Main features:
* Welcomes new members in dedicated welcome channel when they join the server
* Command for members to verify using a code emailed by [this google script](https://github.com/mtsev/seba-form-script) and updates their roles
* Commands to show, hide, and archive categories to easily manage categories for Discord events

Bonus features:
* "Late Nights" category that only appears during the cursed hours of 12-6am
* "Lounge of Legends" mode for the "lounge" voice channel which activates when someone in lounge is playing League

## Installation
Download the source code from the [latest release](https://github.com/mtsev/seba/releases/latest).

You can run this bot in [Docker](https://docs.docker.com/get-docker/) on a Linux server with `./start`.

Alternatively, you can run it manually. This bot requires Node.js to run. Dependencies can be installed with `npm install`. Then you can start the bot with `npm start`.

## Configuration
Copy `config-sample.json` to `config.json` and set the following values:

* `prefix` is the string proceeding a bot command
* `token` is the Discord bot token. Get this from the [Discord Developer Portal](https://discordapp.com/developers/applications/)
* `server` has info regarding your server as follows:
    - `id` is the ID of your Discord server
    - `name` is the name of your Discord server
    - `email` is the contact email address in case of issues
* `categories` has the IDs of categories in your server:
    - `exec` is the ID of the exec category to use privileged bot commands in
    - `archive` is the ID of the category that the `archive` command moves channels to
    - `moveable` has the IDs of categories that can be moved with the `show`, `hide`, and `archive` commands. You can add more as required
* `channels` has the IDs of channels in your server:
    - `welcome` is the ID of the channel for the bot to welcome new members in
    - `rules` is the ID of the channel with rules or other info you want members to read
    - `verify` is the ID of the channel for members to verify in
* `roles` has the IDs of user roles in your server:
    - `verified` is the ID of the role to assign to members once they verify
    - `exec` is the ID of the exec or admin role to use privileged bot commands
* `seed` is a secret value used to generate the verification code. **Must be the same as the google script seed value**

To enable bonus features, copy `bonusConfig-sample.json` to `bonusConfig.json` and set the following values:

* `latenights` is the ID of the "Late Nights" category
* `lounge` is the ID of the "lounge" voice channel
