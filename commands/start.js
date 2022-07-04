// Starts a new game of art telephone
// Require the slash command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
const path = require('node:path'); // directories

// open database
const Database = require("@replit/database");
const db = new Database();

// schemas
const schemaPath = path.join(__dirname, '..', 'schemas');
const gameData = require(path.join(schemaPath, 'gameData.js'));

// Export as a module for other files to require()
module.exports = {
  data: new SlashCommandBuilder() // command details
    .setName('start')
    .setDescription('Start a game of art telephone!')
    
    // new game subcommand (the input is a subcommand builder)
    .addSubcommand(subcommand =>
      subcommand
        .setName('new')
        .setDescription('Start a new art telephone sign-up list.')

        .addStringOption(option =>
          option.setName('name')
            .setDescription("enter a name for your game")
            .setRequired(true) // must provide a name (make default value, not required)
        )
    )

    // existing game subcommand
    .addSubcommand(subcommand =>
      subcommand
        .setName('existing')
        .setDescription('Start a game from an existing sign-up list.')
        .addStringOption(option =>
          option.setName('name')
            .setDescription("enter the existing game's name")
            .setRequired(true) // must provide a name
            .setAutocomplete(true)) // TODO: program to provide a list of existing game names
    ),
  async execute(interaction) { // command functions  
    // NEW GAME
    if (interaction.options.getSubcommand() === 'new') {
      let messageId = await interaction.deferReply({ fetchReply: true }).message.id; // remember to write AWAIT before these (this is valid in an async function)

      interaction.editReply('React to this message to sign up!'); // OR MAYBE USE A BUTTON INSTEAD!!! WOAH

      // partials?
    } else if (interaction.options.getSubcommand() === 'existing') {
      return await interaction.reply('testing');
    }
  }
};