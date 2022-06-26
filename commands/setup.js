// depends on slash commands and role/channel creation and embeds

// Require the slash command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
const path = require('node:path');
const Database = require("@replit/database");
const db = new Database();

// schema modules
const schemaPath = path.join(__dirname, '..', 'schemas'); // folder with all the schemas
const guildData = path.join(schemaPath, 'guildData.js'); // for guild data factory function
const settingsData = path.join(schemaPath, 'settingsData.js'); // for settings data factory function

// Export as a module for other files to require()
module.exports = {
  data: new SlashCommandBuilder() // command details
    .setName('setup')
    .setDescription('Setup with default settings.'),
  async execute(interaction) { // command functions
    await interaction.deferReply({ ephemeral: true }); // open 15-minute response window, ephemeral
    const guild = interaction.guild;
    const guildId = interaction.guild.id; // save the guild id to access database

    if (!guild || !guild.available) return interaction.editReply('Error accessing guild.');

    // Create a new role with data and a reason https://discord.js.org/#/docs/main/stable/class/RoleManager?scrollTo=create
    const activePlayer = 
    await guild.roles.create({
      name: 'Calling in...',
      color: 'YELLOW',
      reason: 'A role for the player who is making the next art piece.',
    }); // role for active player
    
    const mod =
    await guild.roles.create({
      name: 'Operator',
      color: 'PINK',
      reason: 'A role for the mods who manage the game.',
    }); // create role for mods

    if (!activePlayer || !mod) return interaction.editReply('Error creating roles.');
    
    // Create new call center channel (for logs) from https://discord.js.org/#/docs/main/stable/class/GuildChannelManager?scrollTo=create
    // Create private channel based on https://stackoverflow.com/questions/57339085/discord-bot-how-to-create-a-private-text-channel
    const callCenter =
    await guild.channels.create('call-center', {
      type: 'GUILD_TEXT', // https://discord.js.org/#/docs/main/stable/typedef/ChannelType
      permissionOverwrites: [
        {
          id: interaction.guild.id, // todo: hm? maybe I need to set everyone to not be able to see it
          deny: [Permissions.FLAGS.VIEW_CHANNEL],
        }, 
        {
          id: mod.id,
          allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES],
        }
      ],
    });

    if (!callCenter) return interaction.editReply('Error creating logs channel.');
    
    // create guild settings
    const settings = settingsData(callCenter, mod, activePlayer);
    // create guild object
    const guildObj = guildData(settings);

    db.set(guildId, guildObj); // create guild object in the database

    
  },
};