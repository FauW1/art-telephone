// Require the slash command builder
const { SlashCommandBuilder } = require('@discordjs/builders');

// require modules
const path = require('node:path');
const Database = require("@replit/database");
const db = new Database();

// schema modules
const schemaPath = path.join(__dirname, '..', 'schemas'); // folder with all the schemas
const gameData = require(path.join(schemaPath, 'guildData.js')); // for game data factory function
const userData = require(path.join(schemaPath, 'userData.js'));

// embed/component modules
const miscPath = path.join(__dirname, '..', 'misc'); // folder with all the embeds/components
const { signUpEmbed, timerEmbed, actionRow } = require(path.join(miscPath, 'embeds.js')); // for embeds

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

    // create a row
    const timeStamp = Date.now(); // current ms from epoch time
    const joinId = `j${timeStamp}`; // id of join button
    const leaveId = `l${timeStamp}`; // id of leave button
    const row = actionRow(joinId, leaveId); // create row of buttons
    
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
    let countDown = setInterval(() => {
      if (timeLeft >= 0) {
        timeLeft--;
        if (timeLeft % 60 === 0 || timeLeft < 15) { // time checks
          interaction.editReply({ embeds: [playersEmbed, timerEmbed(timeLeft)] }); // update
          console.log('timerUpdate' + playersEmbed);
        }
      }
    }, // every second
      1000); // countdown every second

    let userArray = [];

    // Collectors: https://discordjs.guide/popular-topics/collectors.html#interaction-collectors
    const filter = i => {
      // i.deferUpdate();
      return i.message.id === msg.id;
    }; // filter only interactions on this message that is a button
    const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: timeLeft * 1000 }); // collector using the timeLeft

    await interaction.editReply({ content: `**Click on the button below to join the game!** _Max players allowed: ${maxNum}_`, components: [row], embeds: [playersEmbed, timerEmbed(timeLeft)] });

    collector.on('collect', async i => {
      let maxReached = false; // begin as false
      if (maxNum) {
        maxReached = userArray.length >= maxNum ? true : false; // whether the max number of players reached
      }

      // new user
      let newUser = i.user;

      if (i.customId === joinId) {

        if (userArray.includes(newUser)) {

          await i.reply({ content: 'You have already signed up!', ephemeral: true });

        } else if (maxReached) {

          await i.reply({ content: `Maximum of ${maxNum} players reached!`, ephemeral: true });

        } else {
          userArray.push(newUser); // add a new user to the user array
          // response
          playersEmbed = signUpEmbed({ userArray: userArray, gameName: gameName });

          //todo: delete
          console.log('userarray' + userArray);
          console.log(playersEmbed);

          await interaction.editReply({ embeds: [playersEmbed, timerEmbed(timeLeft)] });
          await i.reply({ content: `You have signed up for the game **${gameName}**`, ephemeral: true });
        }

      } else if (i.customId === leaveId) {

        if (userArray.includes(newUser)) {
          userArray = userArray.filter(user => user != newUser); // only keep elements that is not the current user

          // response
          playersEmbed = signUpEmbed({ userArray: userArray, gameName: gameName });
          await interaction.editReply({ embeds: [playersEmbed, timerEmbed(timeLeft)] });
          await i.reply({ content: `You have left the game **${gameName}**`, ephemeral: true })
        } else {
          await i.reply({ content: `You are not in the game **${gameName}**`, ephemeral: true })
        }
      }
    });

    collector.on('end', () => {
      game.users = userArray.map(user => userData(user)); // make a user data array

      timeLeft = 0; // set back to 0
      clearInterval(countDown);

      return interaction.editReply({ content: "Time's up!", components: [], embeds: [playersEmbed] }); // update
    });
  },
};