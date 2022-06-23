//https://discordjs.guide/interactions/autocomplete.html#sending-results
const char = process.env.EXIST_CHAR;

// Dynamically execute commands
module.exports = {
  name: 'interactionCreate',
  async execute(interaction) { //use async because there are awaits
    if (!interaction.isAutocomplete()) return;
    
    if (interaction.commandName === 'start') {
      const focusedValue = interaction.options.getFocused();

      const db = interaction.client.db;
      const choices = await db.list(char); // make an array of possible names
      choices.forEach(match => match.slice(1)); // without the special character
    
      console.log(choices); //TODO: testing
    
      const filtered = choices.filter(choice => choice.startsWith(focusedValue));
      await interaction.respond(
        filtered.map(choice => ({ name: choice, value: choice })),
      );
    }
  }
};