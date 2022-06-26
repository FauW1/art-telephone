//https://discordjs.guide/interactions/autocomplete.html#sending-results

// Dynamically execute commands
module.exports = {
  name: 'interactionCreate',
  async execute(interaction) { //use async because there are awaits
    if (!interaction.isAutocomplete()) return;
    
    if (interaction.commandName === 'start') {
      const focusedValue = interaction.options.getFocused();
      
      const choices = ['test', 'hello', 'lol']; // this works
      
      const filtered = choices.filter(choice => choice.startsWith(focusedValue));
      await interaction.respond(
        filtered.map(choice => ({ name: choice, value: choice })),
      );
    }
  }
};