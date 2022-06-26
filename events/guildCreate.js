const Database = require('@replit/database');
const path = require('node:path');

const db = new Database();
const guildData = path.join(__dirname, '..', 'schemas', 'guildData.js'); // access guild data factory function

module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    const guildId = guild.id; // get the guild id

    if (!db.get(guildId)) { // if no guild id key found
      const guildObj = guildData(); // new guild object created
      
      db.set(guildId, guildObj)
        .then(() => { console.log(`${guildId} object added.`) }); // use guild id as key, put in a guild object 
    }
  }
};