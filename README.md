# seba
Verification and server management bot for UNSW lo-fi society's Discord server.

This bot uses a MySQL database backend (seba_schema.sql) to allow access to members' information directly from Discord, even if their Discord username has since changed from when they first verified.

Main features:
* Welcomes new members in dedicated welcome channel when they join the server
* Command for members to verify using a code emailed by [this google script](https://github.com/mtsev/seba-form-script) and updates their roles
* Command for execs to look up any verified member's information from the database
* Commands to show, hide, and archive categories to easily manage categories for Discord events
* Command to move all members from one voice channel to another

Bonus features:
* "Late Nights" category which can only be accessed during a specific time period
* "Gaming Mode" for the "lounge" voice channel which activates when anyone in lounge is playing a specific game

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
    - `name` is the name of your society or Discord server
    - `email` is your society's contact email address in case of issues

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

* `database` has the login information for your MySQL database
    - `host` is the hostname of the database
    - `user` is the MySQL user to authenticate as
    - `password` is the password of that MySQL user
    - `database` is the name of the database to use

* `seed` is a secret value used to generate the verification code. **Must be the same as the google script seed value**

To enable bonus features, copy `bonusConfig-sample.json` to `bonusConfig.json` and set the following values:

* `latenights` has info for the Late Nights feature:
    - `id` is the ID of the "Late Nights" category
    - `start` is the starting time for access to the category in `HH:MM` format
    - `end` is the ending time for access to the category in `HH:MM` format

* `lounge` has info for the Gaming Mode feature:
    - `id` is the ID of the "lounge" voice channel
    - `game` is the name of the game for this feature to activate on
    - `gameMode` is the name of the channel when Game Mode is active
    - `normalMode` is the name of the channel normally
