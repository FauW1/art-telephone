const Database = require("@replit/database");
const db = new Database();

module.exports = {
  name: 'guildCreate',
  async execute(guild){
    guildId = guild.id; // get the guild id
    
    db.set(guildId, {})
      .then(() => {console.log(`${guildId} object added.`)}); // use guild id as key, create an empty object
  }
};