# seba
Verification and server management bot for UNSW lo-fi society's Discord server.

Seba can also optionally use a MySQL database to access to members' information directly from Discord, even if their Discord username has since changed from when they first verified. See instructions in the [database directory](database) if you want to enable this.

Main features:
* Welcomes new members in dedicated welcome channel when they join the server.
* Command for members to verify using a code emailed by [this google script](https://github.com/mtsev/seba-form-script) and updates their roles.
* Persistent verification for members rejoining the server, but does not preserve any other role.
* Commands to show, hide, and archive categories to easily manage categories for Discord events.
* Command to move all members from one voice channel to another.

Optional extra features - disabled unless `extraConfig.json` exists:
* "Late Nights" category which can only be accessed during a specific time period.
* Updates server icon and enables specific custom emojis during this period.

## Installation
Download the source code from the [latest release](https://github.com/mtsev/seba/releases/latest).

You can run this bot in [Docker](https://docs.docker.com/get-docker/) on a Linux server with the `start` script.
```sh
$ ./start
```

Alternatively, you can manually install dependencies and run it. This bot requires Node.js 12.x or higher to run.
```sh
$ npm install
$ npm start
```

On Discord, the bot requires permissions integer `285281296` and privileged gateway intents `presence intent` and `server members intent`.

## Configuration
Copy `config.json.example` to `config.json` and set the following values:

* `prefix` is the string proceeding a bot command
* `token` is the Discord bot token. Get this from the [Discord Developer Portal](https://discordapp.com/developers/applications/)
* `seed` is a secret value used to generate the verification code. **Must be the same as the google script seed value**

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

## Extra features
To enable the extra features, copy `extraConfig.json.example` to `extraConfig.json` and set the following values:

* `latenights` has info for the Late Nights feature:
    - `id` is the ID of the "Late Nights" category
    - `start` is the starting time for access to the category in `HH:MM` format
    - `end` is the ending time for access to the category in `HH:MM` format
