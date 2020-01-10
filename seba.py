#!/usr/bin/env python3
import discord
from discord.ext import commands
import logging
import gcal

"""
# Set up logging
log = logging.getLogger('discord')
log.setLevel(logging.INFO)
handler = logging.FileHandler(filename='discord.log', encoding='utf-8', mode='a')
handler.setFormatter(logging.Formatter('%(asctime)s:%(levelname)s:%(name)s: %(message)s'))
log.addHandler(handler)
"""

# Read keys file into dict
keys = {}
with open('./keys') as fh:
    for line in fh:
        key, value = line.strip().split('=')
        keys[key] = value.strip()

# Initialise
bot = commands.Bot(command_prefix='!', help_command=None)
#print("\n".join(gcal.upcoming_events()))

# Start up actions
@bot.event
async def on_ready():
    print(f'We have logged in as {bot.user}')

"""
Testy test
"""
@bot.command()
async def ping(ctx):
    if ctx.channel.category_id == 642331629360119809:
        await ctx.send("pong!")

"""
Interact with Google Calendar events.
"""
@bot.command()
async def event(ctx, cmd, *args):

    # List upcoming events
    if cmd == 'list':
        message = "\n".join(gcal.upcoming_events())
        await ctx.send(f'```{message}```')

# Run bot
bot.run(keys['TOKEN'])