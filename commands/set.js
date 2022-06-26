// Require the slash command builder
// TODO: DEBUG THIS
const { SlashCommandBuilder } = require('@discordjs/builders');

// Export as a module for other files to require()
module.exports = {
	data: new SlashCommandBuilder() // command details
		.setName('set')
		.setDescription('Setup with default settings.'),
	async execute(interaction) { // command functions
    
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