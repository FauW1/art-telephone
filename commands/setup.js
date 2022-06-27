// depends on slash commands and role/channel creation and embeds

// Require the slash command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js'); // to use permissions

const path = require('node:path');
const Database = require("@replit/database");
const db = new Database();

// schema modules
const schemaPath = path.join(__dirname, '..', 'schemas'); // folder with all the schemas
const guildData = require(path.join(schemaPath, 'guildData.js')); // for guild data factory function
const settingsData = require(path.join(schemaPath, 'settingsData.js')); // for settings data factory function

// embed modules
const embedsPath = path.join(__dirname, '..', 'embeds');
const serverSettings = require(path.join(embedsPath, 'server-settings.js')); // for server settings constructor

// call center permissions
const modPerms = Permissions.FLAGS.MODERATE_MEMBERS;

// Export as a module for other files to require()
module.exports = {
  data: new SlashCommandBuilder() // command details
    .setName('setup')
    .setDescription('Setup with default settings.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(modPerms),
  async execute(interaction) { // command functions
    await interaction.deferReply({ ephemeral: true }); // open 15-minute response window, ephemeral
    const guild = interaction.guild;
    const guildId = interaction.guild.id; // save the guild id to access database

    if (!guild || !guild.available) return await interaction.editReply('Error accessing guild.');

    const guildCurrVal = await db.get(guildId).then(value => {
      if (!value) { // if value is falsy
        db.set(guildId, null)
          .then(() => { console.log(`${guildId} object added.`) });
        return null;
      } else {
        return value.settings;
      }
    }); // do settings exist?

    if (guildCurrVal) { // if there are already settings
      const { channel, mods, activePlayer } = guildCurrVal; // destructuring assignment, take these values from settings

      const responseEmbed = serverSettings(guild, channel, mods, activePlayer);
      return interaction.editReply({ content: 'Already set up.', embeds: [responseEmbed] });
    } else {
      // Create a new role with data and a reason https://discord.js.org/#/docs/main/stable/class/RoleManager?scrollTo=create

      let mods =
        await guild.roles.create({
          name: '📞Operator',
          color: 'ed6a5a', // a red color
          reason: 'A role for the mods who manage the game.',
        }); // create role for mods

      let activePlayer =
        await guild.roles.create({
          name: '📞Calling in...',
          color: 'YELLOW',
          reason: 'A role for the player who is making the next art piece.',
        }); // role for active player
      
      if (!activePlayer || !mods) return await interaction.editReply('Error creating roles.');

      // THIS CODE IS JUST GOOD-TO-HAVE, DEPENDENT ON PRIVILEGED INTENT: GUILDS_MEMBERS -- REMOVE IF CAUSING PROBLEMS!!!
      // Assign mod role to admins (https://www.codegrepper.com/code-examples/javascript/get+every+member+of+a+server+discord+js)
      // Fetch and get the list named 'members'
      guild.members.fetch().then(members => {
        // Loop through every member
        members.forEach(member => {
          if(member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) || member.permissions.has(modPerms)) {
            member.roles.add(mods);
          }
        });
      });

      // Create new call center channel (for logs) from https://discord.js.org/#/docs/main/stable/class/GuildChannelManager?scrollTo=create
      // Create private channel based on https://stackoverflow.com/questions/57339085/discord-bot-how-to-create-a-private-text-channel
      let callCenter =
        await guild.channels.create('call-center', {
          type: 'GUILD_TEXT', // https://discord.js.org/#/docs/main/stable/typedef/ChannelType
          permissionOverwrites: [
            {
              id: interaction.guild.id, // THIS WORKS! sets it to a private channel that everyone cannot see ( The guild ID doubles as the role id for the default role @everyone, https://discordjs.guide/popular-topics/permissions.html#channel-overwrites)
              deny: [Permissions.FLAGS.VIEW_CHANNEL],
            },
            {
              id: mods.id,
              allow: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.SEND_MESSAGES], //override so that only the mods can see it
            }
          ],
        });

      if (!callCenter) return await interaction.editReply('Error creating logs channel.');

      // create guild settings
      const settings = settingsData(callCenter, mods, activePlayer);
      // create guild object
      const guildObj = guildData(settings);

      db.set(guildId, guildObj); //.then(console.log(guildObj)); // create guild object in the database

      // response embed (contains all the info to send to users)
      const responseEmbed = serverSettings(guild, callCenter, mods, activePlayer);

      return await interaction.editReply({ embeds: [responseEmbed] }); // respond with the embeds 
    }
  },
};