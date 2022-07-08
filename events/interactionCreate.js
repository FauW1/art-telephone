//https://discordjs.guide/interactions/autocomplete.html#sending-results
const Database = require("@replit/database");
const db = new Database();

// Dynamically execute commands
module.exports = {
  name: 'interactionCreate',
  async execute(interaction) { //use async because there are awaits
    if (interaction.isCommand()) { // commands
      const command = interaction.client.commands.get(interaction.commandName); //get the data from commands with the command name

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }

    } else if (interaction.isAutocomplete()) { // autocomplete
      
      if (interaction.commandName === 'start') {
        const focusedValue = interaction.options.getFocused();
        const guildId = interaction.guild.id; // get the guild id

        const choices = await db.get(guildId).then(guildData => {
          const gameNames = guildData.queued.map(game => game.name); // create a new array of only game names
          return [... new Set(gameNames)]; // an array of unique game names
        }); // unknown functionality

        const filtered = choices.filter(choice => choice.startsWith(focusedValue));
        await interaction.respond(
          filtered.map(choice => ({ name: choice, value: choice })),
        );
      }
    } else if (interaction.isButton()) {

      if (interaction.customId === 'join') { // TODO: finish this
        interaction.message.embeds[0]; // get the first embed
      }
    } else {
      return;
    }
  }
};