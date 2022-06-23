// Starts a new game of art telephone
// Require the slash command builder
const { SlashCommandBuilder } = require('@discordjs/builders');
char = process.env.EXIST_CHAR; //special character to add before responses
NewChar = process.env.ACTIVE_CHAR; //special character to add before responses

// open database
const Database = require("@replit/database");
const db = new Database();

// Export as a module for other files to require()
module.exports = {
  data: new SlashCommandBuilder() // command details
    .setName('start')
    .setDescription('Start a game of art telephone!')

    // new game subcommand (the input is a subcommand builder)
    .addSubcommand(subcommand =>
      subcommand
        .setName('new')
        .setDescription('Start a new art telephone sign-up list.')

        .addStringOption(option =>
          option.setName('name')
            .setDescription("enter a name for your game")
            .setRequired(true) // must provide a name
        )
    )

    // existing game subcommand
    .addSubcommand(subcommand =>
      subcommand
        .setName('existing')
        .setDescription('Start a game from an existing sign-up list.')
        .addStringOption(option =>
          option.setName('name')
            .setDescription("enter the existing game's name")
            .setRequired(true) // must provide a name
            .setAutocomplete(true)) // TODO: program to provide a list of existing game names
    ),

  async execute(interaction) { // command functions
    // from https://discordjs.guide/interactions/slash-commands.html#parsing-options
    
    // NEW GAME
    if (interaction.options.getSubcommand() === 'new') {
      let reply;
      interaction.channel.send('React to this message if you would like to participate in a game!')
        .then(message => {
        console.log(`message sent ${message.content}`);
        reply = message;
      })
        .catch(console.log);

      console.log(reply);
      
      await interaction.deferReply(); // open 15-min window
      
      const name = interaction.options.getString('name'); // game name created
      const time = new Date(); // get time now in milliseconds
      const key = char + name + time; // create a key for the message sent

      const messageId = reply.message.id; // gets the message id of the reply
      db.set(key, messageId); //store into the database

      return await interaction.editReply(`New game (${key}) created.`);
    }

    // EXISTING GAME
    else if (interaction.options.getSubcommand() === 'existing') {
      await interaction.deferReply(); // open 15-min window
      
      const name = interaction.options.getString('name'); // game name created
      const key = char + name; // create key in the format of SPEC_CHAR + name ('&name'), without time stamp
      const gamesFound = await db.list(key);
      const numFound = gamesFound.length;

      console.log(gamesFound);

      if (numFound === 0) { // no games found 
        return interaction.editReply({ content: 'No games of that name found.', ephemeral: true });
      } else if (numFound > 1) { // multiple games found
        await interaction.editReply('Which game would you like to start?' + '\n' + gamesFound + '\nPlease respond with the game name exactly as shown.');

        // COLLECTOR https://discordjs.guide/popular-topics/collectors.html#message-collectors
        // `m` is a message object that will be passed through the filter function
        const filter = m => m.content.includes(char);
        const minsAllowed = 5 * 60 * 1000;
        const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: minsAllowed });

        collector.on('collect', m => {
          console.log(`Collected ${m.content}`);
        });

        collector.on('end', collected => {
          console.log(`Collected ${collected.size} items`);
          if (collected.size === 0) {
            return interaction.reply({ content: `Timed out! ${secsAllowed} (ms)`, ephemeral: true });
          }
        });
      }

      // message id
      const msgId = db.get(key);
      const msg = interaction.channel.messages.fetch(msgId) // channel class
  .then(message => console.log(message.content))
  .catch(console.error); // see if this works!(TODO) https://discord.js.org/#/docs/main/stable/class/MessageManager?scrollTo=fetch , https://stackoverflow.com/questions/49442638/get-message-by-id-discord-js

      const userArray = []; // empty array of user info
      msg.reactions.cache.foreach(reaction => {
        const user = reaction.users.cache; // access user info

        userArray.push([user.id, user.displayName]); // user info pushed to user array (TODO: unknown functionality)
      });

      db.delete(key); // remove from unused games

      const time = new Date(); // get time now in milliseconds
      const newKey = newChar + name + time; // active game new key
      db.set(newKey, userArray); // store active game

      // DM FIRST USER! REMEMBER TO SET ROLE TO ACTIVE (TODO)
      const firstUser = await client.users.fetch(userArray[0][0]); // get first user with id
      firstUser.send('YOU ARE THE FIRST IN THE LIST, HERE IS YOUR PROMPT'); // TODO: CHANGE PROMPT DEPENDING ON SETTINGS STORED
      
      // all conditions cared for, now just one game
      return interaction.editReply(`The game ${gamesFound[0]} has begun! with users ${userArray}.`);  // TODO: MAKE A LIST OF PLAYERS FROM REACTIONS, PING THEM
    }

    //TODO: BREAK UP THE CODE
  }
};