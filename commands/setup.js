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
    const activePlayer = await ; // consider using async await syntax
    const mod;

    // create role for active player
    guild.roles.create({
      name: 'Calling in...',
      color: 'YELLOW',
      reason: 'A role for the player who is making the next art piece.',
    })
      .then(role => { activePlayer = role })
      .catch(console.error);

    // create role for mods
    guild.roles.create({
      name: 'Operator',
      color: 'PINK',
      reason: 'A role for the mods who manage the game.',
    })
      .then(role => { mod = role })
      .catch(console.error);

    // Create new call center channel (for logs) from https://discord.js.org/#/docs/main/stable/class/GuildChannelManager?scrollTo=create
    guild.channels.create('call-center', {
      type: 'GUILD_TEXT', // https://discord.js.org/#/docs/main/stable/typedef/ChannelType
      permissionOverwrites: [
        {
          id: message.author.id,
          deny: [Permissions.FLAGS.VIEW_CHANNEL],
        },
      ],
    })

    const settings = settingsData();
    const guildObj = guildData(settings);
  },
};

/*

[BROKEN CODE, COME BACK TO IT LATER]

console.log('begin execution');
    const guild = interaction.guild; // current guild the interaction is in
    const defaultChannel = guild.systemChannelId; // get the system channel of the guild
    const perms = interaction.client.perms; // get the necessary permission flags

    console.log(defaultChannel);
    // if the default channel is a text channel and i have the relevant permissions
    if(defaultChannel && defaultChannel.isText() && guild.me.permissionsIn(defaultChannel).has(perms)){
      //empty statement
    } else {
      // adapted from: https://stackoverflow.com/questions/51447954/sending-a-message-the-first-channel-with-discord-js
      let channels = guild.channels.cache; //channels

      channelLoop:
      for (let key in channels) {
          let c = channels[key]; // for each channel array
          if (c.isText() && guild.me.permissionsIn(defaultChannel).has(perms)) {
            defaultChannel = c[0]; // set to channel id
            console.log('it works!');
            break channelLoop;
          }
      }
    }

    // save these settings
    await client.db.set('defaultChannel', defaultChannel);

    return interaction.reply({
        content: `The default channel has been set to <#${defaultChannel}>. The moderator role is [INSERT MOD ROLE] and the participant role is [INSERT PARTICIPANT ROLE]; embed game rules? idk`,
        ephemeral: true
      }); // if the default channel works, respond

    // TODO: DEFAULT ROLES: MODS AND PARTICIPANTS
    // If found admin, add that admin to the telephone "call center" role, and have commands to add more call center mods?
    // participant role is simply created (remember to check to see if role members match list or sth, maybe before every round)
    // TODO: DEFAULT GAME SETTINGS

*/