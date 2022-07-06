// i think it's broken
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

// timer, can call anonymously without a name, look at deploy commands syntax
let timeLeft = 90; // 15 minutes in seconds

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
    const msgId = interaction.deferReply({ fetchReply: true })
      .then(reply => { return reply.id; });  // open 15-minute window; store msg id; https://discord.js.org/#/docs/discord.js/main/typedef/InteractionDeferReplyOptions

    const guildId = interaction.guild.id; // store the guild id
    const guildObj = await db.get(guildId); // store guild object

    if (!guildObj) {
      return interaction.editReply("You need to run '/setup' first!"); // no guild object found yet
    }

    let gameSettings = guildObj.settings.gameDefault; // get the guild default settings
    // Update game settings
    gameSettings.duration = interaction.options.getInteger('duration');
    gameSettings.unit(interaction.options.getString('units'));
    const maxNum = interaction.options.getInteger('max');
    gameSettings.max = maxNum ? maxNum : NaN;
    // TODO: reaction collector, create a new game based on this, send reminder messages (regularly scheduled, check every second)
    // create a new game
    gameData(interaction.getString('name'), gameSettings, msgId); // create a game object
    timeLeft = (interaction.command.createdTimestamp - Date().now) / 1000; // seconds left
    
    let countDown = setInterval(
      (interaction) => {
        if (timeLeft > 0) {
          timeLeft -= 1;
          interaction.editReply({ content: `Click on the button below to join the game!\n\n${timeLeft} seconds left.`, components: [actionRow] }); // TODO: ADD RELEVANT EMBED
        } else { // AS BUTTON CLICKED, CREATE AN EMBED OF LIST OF PLAYERS WHO REGISTERED, DO NOT CLEAR IT ON TIME OUT
          timeLeft = 0;
        }
      }, // every {}second
          1000); // countdown every second

    if (timeLeft <= 0) clearInterval(countDown); // stop the countdown

    return interaction.editReply({ content: "Time's up!" }); // todo: add relevant embeds

    // FROM BUTTON INTERACTION, COUNT NUMBER OF PLAYERS: if max reached, Stop timer here and edit the message to full!
  },
};