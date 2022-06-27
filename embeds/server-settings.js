const { MessageEmbed } = require('discord.js'); // to use embeds
// https://discordjs.guide/popular-topics/embeds.html#using-the-embed-constructor

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
    { name: 'Mod Role', value: `<@&${mods.id}>` },
    { name: 'Active Player Role', value: `<@&${activePlayer.id}>` },
  )
  .setTimestamp();
};

module.exports = serverSettings;