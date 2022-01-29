# User guide to seba

Seba is lo-fi society's custom Discord bot which handles [server verification](https://docs.google.com/document/d/1n6ceSaPFd2As4RM6arEkjh_BIA2IkFg8Mnsm9V3yg24/edit) and also has exec-only commands for managing events and members. 

If something is horribly broken or there is a bot-related emergency, ping `NaCl#9482` in the `bot-commands` channel.
   

## Anatomy of a bot command

This guide has commands laid out using the following convention.

|     Part    | Description |
| ----------- | ----------- |
| `!command_name` | `!` is the default command prefix. This can be changed with the `prefix` command if necessary. If you forget what the prefix is, ping seba. |
| `[optional_parameter]` | Square brackets `[ ]` indicates that the parameter is **optional**. You can use the command without this parameter. |
| `<required_parameter>` | Angle brackets `< >` indicates that the parameter is **required**. You must enter this parameter to use the command. |

## Event commands

These are commands to manage categories and channels in the server for running online events.

|   Command   | Description |
| ----------- | ----------- |
| `!event [category_name] <category_tag>` | Tags category that the command is sent into as an event category with `<category_tag>`. This tag will be used for identifying the category to be shown/hidden/archived. |
| `!show [category_tag]` | |
| `!hide [category_tag]` | |
| `!archive [category_tag]` | Moves all channels in the category to the Events Archive category. `category_tag` is the tag name for an events category, e.g. {creative, events, latenights}. If no `category_tag` is specified, seba will archive the category the command was sent in. |

## Member commands

These are commands for getting member information or managing members in the server. These commands can only be used in the `bot-command` channel.

|   Command   | Description |
| ----------- | ----------- |
| `!info <server_member>` | |
| `!alias <server_member>` | |
| `!move <voice_channel>` | You **must** be connected to the voice channel you want to move members from. The destination voice channel name may contain spaces and emojis. You don't need to type the emojis, just leave them out. |
| `!check <server_member>` | |

## Other commands

|   Command   | Description |
| ----------- | ----------- |
| `!prefix <server_member>` | |
| `!help` | |