// TODO: RENAME THIS TO MISC., add server settings to this as well
const { MessageEmbed } = require('discord.js');

// theme colors (TODO: edit the blue)
const mainColor = 0x8f3985;
const mainStr = '#8f3985';
const secondaryColor = 0x0099ff;
const secondaryStr = '#0099ff';

// custom signUpEmbed constructor
const signUpEmbed = ( // using object destructuring, accept an object with specified arguments
  { userArray = undefined, 
   gameName = 'New Game' } = {}) => {
    
  let tempEmbed = new MessageEmbed() // used in the initial join message
    .setColor(mainStr) // theme color
    .setTitle(gameName)
    .setDescription('Here are all the players who have signed up.');
  
  if (userArray) {
    for (user in userArray) {
     tempEmbed.addField(user.toString(), '\n'); // create field with name
    }
    tempEmbed.setFooter(`${userArray.length} players.`);
  }

  return tempEmbed;
};

const timerEmbed = (timeLeft) => {
  return new MessageEmbed()
    .setColor(secondaryStr) // change this to some color that fits the theme
    .setTitle('Time left')
    .setDescription(`${timeLeft} seconds to sign up.`);
}

const serverSettings = (guild, callCenter, mods, activePlayer) => {
  return new MessageEmbed() // this can be refactored -> put into embeds folder 
  .setColor(mainStr)
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

// syntax: https://www.sitepoint.com/understanding-module-exports-exports-node-js/
exports.signUpEmbed = signUpEmbed;
exports.timerEmbed = timerEmbed;
exports.serverSettings = serverSettings;