// Require the slash command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
const Database = require("@replit/database");
const db = new Database();

// Export as a module for other files to require()
module.exports = {
	data: new SlashCommandBuilder() // command details
		.setName('dev')
		.setDescription('HI FAUSTINE')
    // display server info
    .addSubcommand(subcommand =>
      subcommand
        .setName('data')
        .setDescription('WTF IS STORED RN.')
    ),
	async execute(interaction) { // command functions
		const guildId = interaction.guild.id;
    if(interaction.options.getSubcommand() === 'data'){
      const guildData = await db.get(guildId);
      return interaction.reply(`Server ID: ${guildId}\nguildData:\n ${JSON.stringify(guildData)}`); // if not stringified, will just print [object Object]
    }
	},
};