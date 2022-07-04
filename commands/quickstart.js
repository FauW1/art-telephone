// Require the slash command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// message actions
const { MessageActionRow, MessageButton } = require('discord.js');

// Export as a module for other files to require()
module.exports = {
  data: new SlashCommandBuilder() // command details
    .setName('quickstart')
    .setDescription('Quickly start a new game of art telephone with basic settings.')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Enter a name for the game.')
        .setRequired(true)) // must provide a name

    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('How long each player gets to draw.')
        .setRequired(true)
        .setAutocomplete(true))

    .addStringOption(option =>
  		option.setName('units')
  			.setDescription('Time units for the duration.')
  			.setRequired(true)
  			.addChoices( // based on switch statement specified in gameDefault (settings)
  				{ name: 'Second(s)', value: '0' },
          { name: 'Minute(s)', value: '1' },
          { name: 'Hour(s)', value: '2' },
          { name: 'Day(s)', value: '3' },
          { name: 'Week(s)', value: '4' },
  			))
    
    .addIntegerOption(option =>
      option.setName('max players')
            .setDescription('The maximum number of players allowed.')
            .setRequired(true)),
  
	async execute(interaction) { // command functions
    // TODO: reaction collector, create a new game based on this, send reminder messages (regularly scheduled, check every second)
    return interaction.reply('Pong!');
  },
};