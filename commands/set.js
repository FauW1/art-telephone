// Require the slash command builder
const { SlashCommandBuilder } = require('@discordjs/builders');

// Export as a module for other files to require()
module.exports = {
	data: new SlashCommandBuilder() // command details
		.setName('set')
		.setDescription('Create default settings.'),
	async execute(interaction) { // command functions
    
    const guild = interaction.guild; // current guild
    const defaultChannel = guild.systemChannelId; // get the system channel of the guild
    const 

    
    if(defaultChannel && guild.me.permissionsIn(defaultChannel).has())
    
    return interaction.reply(guild.systemChannelId);
    // DEFAULT ROLES: MODS AND PARTICIPANTS

    // DEFAULT GAME SETTINGS
	},
};