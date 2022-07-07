// Require the slash command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// message actions
const { MessageActionRow, MessageButton } = require('discord.js');

// require modules
const path = require('node:path');
const Database = require("@replit/database");
const db = new Database();

// schema modules
const schemaPath = path.join(__dirname, '..', 'schemas'); // folder with all the schemas
const gameData = require(path.join(schemaPath, 'guildData.js')); // for game data factory function

// combine w embeds as "embeds and components", like "support" and "info" link buttons; for buttons: https://discordjs.guide/interactions/buttons.html#building-and-sending-buttons
const actionRow = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId('join')
      .setLabel('Join')
      .setStyle('PRIMARY'),
  );

// Export as a module for other files to require()
module.exports = {
  data: new SlashCommandBuilder() // command details
    .setName('quickstart')
    .setDescription('Quickly start a new game in this channel.')
    .addStringOption(option =>
      option.setName('name') // option names can only have one word
        .setDescription('Enter a name for the game.')
        .setRequired(true)) // must provide a name

    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('How long each player gets to draw.')
        .setRequired(true))

    .addStringOption(option =>
      option.setName('units')
        .setDescription('Time units for the duration.')
        .setRequired(true)
        .addChoices( // based on switch statement specified in gameDefault (settings)
          { name: 'hour(s)', value: '2' },
          { name: 'day(s)', value: '3' },
          { name: 'week(s)', value: '4' },
          { name: 'minute(s)', value: '1' },
          { name: 'second(s)', value: '0' },
        ))

    .addIntegerOption(option =>
      option.setName('max')
        .setDescription('How many participants are allowed.')),

  async execute(interaction) { // command functions
    msg = await interaction.deferReply({ fetchReply: true });  // open 15-minute window https://discord.js.org/#/docs/discord.js/main/typedef/InteractionDeferReplyOptions

    const guildId = interaction.guild.id; // store the guild id
    const guildObj = await db.get(guildId); // store guild object

    if (!guildObj) {
      return interaction.editReply("You need to run '/setup' first!"); // no guild object found yet
    }
    // TODO: reaction collector, create a new game based on this, send reminder messages (regularly scheduled, check every second)
    interaction.editReply({ content: `Click on the button below to join the game!`, components: [actionRow] }); // TODO: ADD RELEVANT EMBED, AS BUTTON CLICKED, CREATE AN EMBED OF LIST OF PLAYERS WHO REGISTERED, DO NOT CLEAR IT ON TIME OUT

    let timeLeft = 900; // seconds left, from 15 min
    console.log(timeLeft);

    timerMsg = await interaction.followUp({ content: `${timeLeft} seconds left to sign up.`, fetchReply: true });

    let countDown = await setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        timerMsg.edit(`${timeLeft} seconds left to sign up.`)
      } else {
        timeLeft = 0;
        timerMsg.delete(); // delete the count down message
        clearInterval(countDown);

        // create a new game
        let gameSettings = guildObj.settings.gameDefault; // get the guild default settings
        // Update game settings
        gameSettings.duration = interaction.options.getInteger('duration');
        gameSettings.unit = interaction.options.getString('units');
        const maxNum = interaction.options.getInteger('max');
        gameSettings.max = maxNum ? maxNum : NaN;
        gameData(interaction.options.getString('name'), gameSettings, msg.id); // create a game object

        return interaction.editReply({ content: "Time's up!", components: [actionRow.components[0].setDisabled(true)] }); // todo: add relevant embeds

        // FROM BUTTON INTERACTION, COUNT NUMBER OF PLAYERS: if max reached, Stop timer here and edit the message to full!
      }
    }, // every second
      1000); // countdown every second
  },
};