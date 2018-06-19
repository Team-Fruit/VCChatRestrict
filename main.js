// Discord.js
const Discord = require('discord.js');

// token.template.js、settings.template.js から記入済みの token.js、settings.js を作成して下さい
const DiscordToken = require('./token.js');
const DiscordSettings = require('./settings.js');

const client = new Discord.Client();

// Bot準備
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// 規制役職付きの人がボイチャに入ったら役職を外す
client.on('voiceStateUpdate', (oldMember, newMember) => {
    let oldUserChannel = oldMember.voiceChannel;
    let newUserChannel = newMember.voiceChannel;
    // if ボイチャに入ったら
    if (oldUserChannel === undefined && newUserChannel !== undefined) {
        let member = newMember;
        // if 規制役職が付いていたら
        if (member.roles.has(DiscordSettings.role)) {
            // 規制役職を外す
            member.removeRole(DiscordSettings.role);
        }
    }
});

// ボイチャに入っていない人が書き込みをしたら、書き込みを削除して規制役職を付ける
client.on('message', message => {
    // if VCチャンネルだったら
    if (DiscordSettings.channels.includes(message.channel.id)) {
        let member = message.member;
        // if ボイチャに入っていなかったら
        if (member.voiceChannel === undefined) {
            // if 規制役職が付いていなかったら
            if (!member.roles.has(DiscordSettings.role) &&
                !DiscordSettings.whitelist.some(role => member.roles.has(role))) {
                // 役職をつけて
                member.addRole(DiscordSettings.role);
                // メッセージを削除
                message.delete();
            }
        }
    }
});

// Bot開始
client.login(DiscordToken.token);
