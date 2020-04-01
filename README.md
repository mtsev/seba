# seba
Bot for UNSW lo-fi society Discord server.

* Welcomes new members when they join.
* Verifies members using an emailed code (google script) and updates their role.

Rename the sample config file `config.sample.json` to `config.json` and set the following values.

* `prefix` is the string proceeding a bot command.
* `token` is the Discord bot token. Get this from the [Discord Developer Portal](https://discordapp.com/developers/applications/).
* `server` has info regarding your server as follows:
    - `id` is the ID of your Discord server.
    - `name` is the name of your Discord server.
    - `email` is the contact email address in case of issues.
* `channels` has the IDs of channels in your server:
    - `welcome` is the ID of the channel for the bot to welcome new members in.
    - `rules` is the ID of the channel with rules or other info you want members to read.
    - `verify` is the ID of the #verification channel.
* `roles` has the IDs of user roles in your server:
    - `verified` is the ID of the role to assign to members once they verify.
    - `exec` is the ID of the exec or admin role to use privileged bot commands.