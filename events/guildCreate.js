const Database = require('@replit/database');
const db = new Database();

module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    const guildId = guild.id; // get the guild id

    if (!db.get(guildId)) { // if no guild id key found
      db.set(guildId, {})
        .then(() => { console.log(`${guildId} object added.`) }); // use guild id as key, put in an empty object 
    }
  }
};