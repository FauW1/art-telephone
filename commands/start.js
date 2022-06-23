// Starts a new game of art telephone
// Require the slash command builder
const { SlashCommandBuilder } = require('@discordjs/builders');

// Export as a module for other files to require()
module.exports = {
	data: new SlashCommandBuilder() // command details
		.setName('start')
		.setDescription('Start a game of art telephone!')

    // new game subcommand (the input is a subcommand builder)
    .addSubcommand(subcommand =>
        subcommand
            .setName('new')
            .setDescription('Start a new art telephone sign-up list.'))

    // existing game subcommand
    .addSubcommand(subcommand =>
        subcommand
            .setName('existing')
            .setDescription('Start a game from an existing sign-up list.')
            .addNumberOption(option =>
              option.setName('id')
                    .setDescription("enter the existing game's ID")
                    .setRequired(true) // must provide an ID
                    .setAutocomplete(true)) // TODO: program to provide a list of existing game ID's
    ),
	
    async execute(interaction) { // command functions
      return interaction.reply('yo');
	  }
};