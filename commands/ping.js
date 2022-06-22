// Require the slash command builder
const { SlashCommandBuilder } = require('@discordjs/builders');

// Export as a module for other files to require()
module.exports = {
	data: new SlashCommandBuilder() // command details
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) { // command functions
		return interaction.reply('Pong!');
	},
};