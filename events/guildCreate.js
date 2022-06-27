const Database = require('@replit/database');
const db = new Database();

module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    const guildId = guild.id; // get the guild id

    console.log(`Joined guild ${guildId}`);
    
    const guildIdFound = await db.get(guildId);
    console.log(`Guild data ${guildIdFound}`);
    
    if (!guildIdFound) { // if no guild id key found
      db.set(guildId, null)
        .then(() => { console.log(`${guildId} object added.`)}); // use guild id as key, put in null
    }
  }
};