// Require the slash command builder
const { SlashCommandBuilder } = require('@discordjs/builders');

// Export as a module for other files to require()
module.exports = {
	data: new SlashCommandBuilder() // command details
		.setName('start')
		.setDescription('Start a game of art telephone!')
        
        .addSubcommand(subcommand => { // new game subcommand
            subcommand
                .setName('new')
                .setDescription('Start a new art telephone sign-up list.')
                .setRequired(true); //must do a subcommand (see if this works)
        })
        
        .addSubcommand(subcommand => { // existing game subcommand
            subcommand
                .setName('existing')
                .setDescription('Start a game from an existing sign-up list.')
                .setRequired(true); //must do a subcommand (see if this works)
        }),
	
    async execute(interaction) { // command functions
		if(interaction.options.getSubcommand === 'new'){
        } else if
	},
};