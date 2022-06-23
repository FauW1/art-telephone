// saves the default settings to the database
// from: https://stackoverflow.com/questions/51447954/sending-a-message-the-first-channel-with-discord-js

module.exports = {
	name: 'guildCreate',
	execute(guild) { // guildCreate returns the guild object
    
    // DEFAULT CHANNEL
    let channelId;
    let channels = guild.channels.cache; // returns all the server channels as a collection
    console.log(channels);

    // loop to access channels
    for (let key in channels) { // for in loop bc it is JSON(?)
      let channel = channels[key]; // access the channel at that key
      console.log(channel); // TODO: debug
      if (!channel.type) continue; // if no type, go to the next one
      if (channel.type === 'text') {
          channelId = channel.id;
          break; // once the first text channel is found, break out of the loop
      }
    }

    // systemChannelID may be null, set to whichever value is truthy; this is the channel OBJECT
    let defaultChannel = guild.channels.cache.get(guild.systemChannelId | channelId); // TODO: check bitwise OR syntax

    console.log(defaultChannel);
    
    channel.send(`Thanks for inviting me to this server! The art telephone default channel is set to <#${defaultChannel.id}>; the mods role is set to [DEFAULT MOD ROLE], the game participant role is set to [PARTICIPANT ROLE], and the active participant (who would currently have the drawing) is set to [ACTIVE PARTICIPANT ROLE].`); // TODO: SETUP GUIDE and share defaults
    
    guild.client.db.set('channel', defaultChannel) //access the client and set the database
      .then(() => console.log('successfully set default channel on start'))
      .catch(() => console.log('failed to set default channel on start')); 

    // DEFAULT ROLES: MODS AND PARTICIPANTS

    // DEFAULT GAME SETTINGS
	}
};