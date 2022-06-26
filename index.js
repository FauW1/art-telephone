// Require necessary file
const fs = require('node:fs');
const path = require('node:path');
const keepAlive = require('./bot-server.js');
const { Client, Collection, Intents, Permissions } = require('discord.js');

// Use environment variables
const token = process.env.TOKEN;

// New client instance with specified intents
const client = new Client({ intents: [
  Intents.FLAGS.GUILDS, // basic/necessary functions
  Intents.FLAGS.GUILD_MESSAGES //send messages
]});

// Necessary Permissions for bot to work (bot may need admin perms anyways ;-; it wants to give roles to everybody)
const botPerms = new Permissions([
  Permissions.FLAGS.ADD_REACTIONS,
  Permissions.FLAGS.VIEW_CHANNEL,
  Permissions.FLAGS.SEND_MESSAGES,
  Permissions.FLAGS.MANAGE_MESSAGES, // elevated permission, needs 2FA
  Permissions.FLAGS.EMBED_LINKS,
  Permissions.FLAGS.ATTACH_FILES,
  Permissions.FLAGS.MANAGE_ROLES,
  Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS // elevated permission, needs 2FA
]);

//patterns from https://www.youtube.com/watch?v=Sihf7B8D4Y8&ab_channel=CodeLyon and command/event handling documentation
client.commands = new Collection(); //commands collection
client.perms = botPerms; // new property referencing bot perms

// get handler files and run their functions
const handlerPath = path.join(__dirname, 'handlers'); // handler folder
const handlerFiles = fs.readdirSync(handlerPath).filter(file => file.endsWith('.js')); // array of handler file names (only .js)

// require each handler
for(handler of handlerFiles){
	const handlerFilePath = path.join(handlerPath, handler); // join handler file name and the handler path
	require(handlerFilePath)(client); // dependency interjection so that the module can access the client instance
}

// Keep bot online
keepAlive();

// Login to Discord
client.login(token);