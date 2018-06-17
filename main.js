const Discord = require('discord.js');
const DiscordToken = require('./token.js');
const DiscordSettings = require('./settings.js');

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
    let newUserChannel = newMember.voiceChannel
    let oldUserChannel = oldMember.voiceChannel

    if (true || (oldUserChannel === undefined && newUserChannel !== undefined) || (newUserChannel === undefined))
    {
        for (let member of newMember.guild.members.values())
        {
            let isRole = member.roles.has(DiscordSettings.role);
            let isVc = member.voiceChannel !== undefined;
            if (isRole && !isVc)
            {
                member.removeRole(DiscordSettings.role);
            }
            else if (!isRole && isVc)
            {
                member.addRole(DiscordSettings.role);
            }
        }
    }
});

client.login(DiscordToken.token);
