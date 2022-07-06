const { MessageEmbed } = require('discord.js'); // to use embeds
// https://discordjs.guide/popular-topics/embeds.html#using-the-embed-constructor

// move into the same file as fawntune embed, then use destructured assignment

/**
* constructs an embed with all the server settings
* @param guild the current guild object
* @param callCenter the current logs channel object
* @param mod the current mod role object
* @param player the current active player role object
* @return returns the embed object
*/

const serverSettings = (guild, callCenter, mods, activePlayer) => {
  return new MessageEmbed() // this can be refactored -> put into embeds folder 
  .setColor('#8f3985')
  .setTitle('Server Set Up Successfully.')
  .setDescription(`Server info for ${guild.name}.`)
  .addFields(
    { name: 'Log Channel⚠️', value: `<#${callCenter.id}> \n(Do NOT delete this channel or the bot messages here)` },
    // { name: '\u200B', value: '\u200B' }, // '\u200B' is a unicode character zero-width space
    { name: 'Mod Role', value: `<@&${mods.id}> \n(Feel free to add or remove users from this role)` },
    { name: 'Active Player Role', value: `<@&${activePlayer.id}> \n(For cosmetic purposes, will be recreated during games)` },
  )
  .setTimestamp();
};

module.exports = serverSettings;

// NOTE: An embed OBJECT!! different from builder
const fawntuneEmbed = {
	color: 0x0824deb,
	title: 'Hope you enjoy my bot!',
	description: 'Check out more of my work and consider supporting me! :)',
  thumbnail: {
    url: "https://i.imgur.com/J0w3MWF.png",
  },
	fields: [
		{ name: 'Support me on Ko-Fi', value: 'https://ko-fi.com/fawntune' },
		{ name: 'Instagram', value: 'https://www.instagram.com/faustine.art/', inline: true },
		{ name: 'Itch.io', value: 'https://fawntune.itch.io/', inline: true },
    { name: 'Linktree', value: 'https://linktr.ee/faustinew'},
	],
};

module.exports = fawntuneEmbed;