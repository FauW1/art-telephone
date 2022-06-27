// depends on slash commands and role/channel creation and embeds

// Require the slash command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js'); // to use embeds

const path = require('node:path');
const Database = require("@replit/database");
const db = new Database();

// schema modules
const schemaPath = path.join(__dirname, '..', 'schemas'); // folder with all the schemas
const guildData = require(path.join(schemaPath, 'guildData.js')); // for guild data factory function
const settingsData = require(path.join(schemaPath, 'settingsData.js')); // for settings data factory function

// Export as a module for other files to require()
module.exports = {
  data: new SlashCommandBuilder() // command details
    .setName('setup')
    .setDescription('Setup with default settings.'),
  async execute(interaction) { // command functions
    await interaction.deferReply({ ephemeral: true }); // open 15-minute response window, ephemeral
    const guild = interaction.guild;
    const guildId = interaction.guild.id; // save the guild id to access database

    if (!guild || !guild.available) return await interaction.editReply('Error accessing guild.');

    const guildCurrVal = await db.get(guildId).then(value => {return value.settings}); // do settings exist?

    if (guildCurrVal){
      return interaction.editReply('Already setup.');
    } else {
      // Create a new role with data and a reason https://discord.js.org/#/docs/main/stable/class/RoleManager?scrollTo=create
    let activePlayer =
      await guild.roles.create({
        name: 'Calling in...',
        color: 'YELLOW',
        reason: 'A role for the player who is making the next art piece.',
      }); // role for active player

    let mod =
      await guild.roles.create({
        name: 'Operator',
        color: 'ed6a5a', // a red color
        reason: 'A role for the mods who manage the game.',
      }); // create role for mods

    if (!activePlayer || !mod) return await interaction.editReply('Error creating roles.');

    // Create new call center channel (for logs) from https://discord.js.org/#/docs/main/stable/class/GuildChannelManager?scrollTo=create
    // Create private channel based on https://stackoverflow.com/questions/57339085/discord-bot-how-to-create-a-private-text-channel
    let callCenter =
      await guild.channels.create('call-center', {
        type: 'GUILD_TEXT', // https://discord.js.org/#/docs/main/stable/typedef/ChannelType
        permissionOverwrites: [
          {
            id: interaction.guild.id, // THIS WORKS! sets it to a private channel that everyone cannot see
            deny: [Permissions.FLAGS.VIEW_CHANNEL],
          },
          {
            id: mod.id,
            allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES], //override so that only the mods can see it
          }
        ],
      });

    if (!callCenter) return await interaction.editReply('Error creating logs channel.');

    // create guild settings
    const settings = settingsData(callCenter, mod, activePlayer);
    // create guild object
    const guildObj = guildData(settings);

    db.set(guildId, guildObj); //.then(console.log(guildObj)); // create guild object in the database

    // response embed
    const responseEmbed = new MessageEmbed() // this can be refactored -> put into embeds folder 
      .setColor('#8f3985')
      .setTitle('Server Set Up Successfully.')
      .setDescription(`Server info for ${guild.name}.`)
      .addFields(
        { name: 'Log Channel⚠️', value: `<#${callCenter.id}> \n(Do NOT delete this channel or the bot messages here)` },
        // { name: '\u200B', value: '\u200B' }, // '\u200B' is a unicode character zero-width space
        { name: 'Mod Role', value: `<@&${mod.id}>` },
        { name: 'Active Player Role', value: `<@&${activePlayer.id}>` },
      )
      .setTimestamp();

    // add fawntune embed

      return await interaction.editReply({embeds: [responseEmbed]}); // respond with the embed 
    }
  },
};