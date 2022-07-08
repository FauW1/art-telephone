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
const userData = require(path.join(schemaPath, 'userData.js'));

// embed/component modules
const embedsPath = path.join(__dirname, '..', 'embeds'); // folder with all the embeds/components
const { signUpEmbed, timerEmbed } = require(path.join(embedsPath, 'components.js')); // for embeds

// combine w embeds as "embeds and components", like "support" and "info" link buttons; for buttons: https://discordjs.guide/interactions/buttons.html#building-and-sending-buttons
const actionRow = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId('joinQ')
      .setLabel('Join')
      .setStyle('PRIMARY'),
    new MessageButton()
      .setCustomId('cancelQ')
      .setLabel('Cancel')
      .setStyle('SECONDARY'),
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
      return await interaction.editReply("You need to run '/setup' first!"); // no guild object found yet
    }

    // create a new game
    let gameSettings = guildObj.settings.gameDefault; // get the guild default settings
    // Update game settings; TODO: make this a set function in gameDefault
    gameSettings.duration = interaction.options.getInteger('duration');
    gameSettings.unit = interaction.options.getString('units');
    const maxNum = interaction.options.getInteger('max');
    gameSettings.max = maxNum ? maxNum : NaN;
    const gameName = interaction.options.getString('name');

    let game = gameData(gameName, gameSettings, msg.id); // create a game object

    // TIMER AND EMBEDS
    let timeLeft = 300; // seconds left, from 5 min

    let playersEmbed = signUpEmbed({ gameName: gameName }); // store signUpEmbed in here

    // start timer
    let countDown = await setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        if (timeLeft % 60 === 0 || timeLeft < 15) { // time checks
          interaction.editReply({ embeds: [playersEmbed, timerEmbed(timeLeft)] }); // update
        }
      }
    }, // every second
      1000); // countdown every second

    let userArray = [];

    // Collectors: https://discordjs.guide/popular-topics/collectors.html#interaction-collectors
    const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: timeLeft * 1000 }); // collector using the timeLeft

    await interaction.editReply({ content: `Click on the button below to join the game! Max players allowed: ${maxNum}`, components: [actionRow], embeds: [playersEmbed, timerEmbed(timeLeft)] });

    collector.on('collect', async i => {
      let maxReached = userArray.length > maxNum ? true : false; // whether the max number of players reached

      if (i.customId === 'joinQ') {

        if (userArray.includes(newUser)) {

          i.reply({ content: 'You have already signed up!', ephemeral: true });

        } else if (maxReached) {

          i.reply({ content: `Maximum of ${maxNum} players reached!`, ephemeral: true });

        } else {
          // new user
          const newUser = userData(i.user);
          userArray.push(newUser); // add a new user to the user array

          // response
          playersEmbed = signUpEmbed({ userArray: userArray, gameName: gameName });
          await interaction.editReply({ embeds: [playersEmbed, timerEmbed(timeLeft)] });
        }

      } else if (i.customId === 'cancelQ') {
        const newUser = i.user;

        if (userArray.includes(newUser)) {
          userArray = userArray.filter(user => user != newUser); // only keep elements that is not the current user

          // response
          playersEmbed = signUpEmbed({ userArray: userArray, gameName: gameName });
          await interaction.editReply({ embeds: [playersEmbed, timerEmbed(timeLeft)] });
        }
      }
    });

    collector.on('end', () => {
      game.users = userArray;

      timeLeft = 0; // set back to 0
      clearInterval(countDown);

      return interaction.update({ content: "Time's up!", embeds: [playersEmbed] });
    });
  },
};