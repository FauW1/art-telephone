// Starts a new game of art telephone
// Require the slash command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
const char = '&'; //special character to add before responses
const NewChar = '%'; //special character to add before responses

// open database
const Database = require("@replit/database");
const db = new Database();

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
      const name = interaction.options.getString('name');
      
      interaction.reply({ content: 'Pong!', fetchReply: true })
        .then((message) => console.log(`Reply sent with content ${message.content}`))
        .catch(console.error);
      /*
      Step 1: SEND A MESSAGE AND GET ITS MESSAGE ID
STEP 2: LEARN HOW TO FETCH MESSAGE
STEP 3: STORE ID INFO (CHAR + NAME + TIMESTAMP)
STEP 4: GET REACTIONS FROM MESSAGE SUCCESSFULLY
STEP 5: GET USER INFO FROM REACTIONS AND STORE
      */
    }
  }
};