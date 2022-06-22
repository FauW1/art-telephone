// Require the slash command builder
const { SlashCommandBuilder } = require('@discordjs/builders');

// Export as a module for other files to require()
module.exports = {
	data: new SlashCommandBuilder() // command details
		.setName('server')
		.setDescription('Display info about this server.'),
	async execute(interaction) { // command functions
		return interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	},
};