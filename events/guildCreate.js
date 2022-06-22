// saves the default settings to the database
// from: https://stackoverflow.com/questions/51447954/sending-a-message-the-first-channel-with-discord-js

module.exports = {
	name: 'guildCreate',
	execute(guild) { // guildCreate returns the guild object
    
    // DEFAULT CHANNEL
    let channelId;
    let channels = guild.channels.cache; // get all the channels

    // loop to access channels
    for (let key in channels) { // for in loop bc it is JSON(?)
      let channel = channels[key]; // access the channel at that key
      if (channel.type === 'text') {
          channelId = channel.id;
          break; // once the first text channel is found, break out of the loop
      }
    }

    // systemChannelID may be null, set to whichever value is truthy
    let defaultChannel = guild.channels.cache.get(guild.systemChannelId || channelId);

    channel.send(`Thanks for inviting me to this server!`); // TODO: SETUP GUIDE
    
    guild.client.db.set('channel', defaultChannel) //access the client and set the database
      .then(() => console.log('successfully set default channel on start'))
      .catch(() => console.log('failed to set default channel on start')); 

    // DEFAULT ROLES: MODS AND PARTICIPANTS

    // DEFAULT GAME SETTINGS
	},
};