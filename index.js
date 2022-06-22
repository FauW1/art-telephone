// Require necessary files
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');

// Use database
const Database = require('@replit/database'); // Import the database

// Use environment variables
const token = process.env.TOKEN;

// New client instance with specified intents
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//patterns from https://www.youtube.com/watch?v=Sihf7B8D4Y8&ab_channel=CodeLyon and command/event handling documentation
client.commands = new Collection(); //commands collection
client.db = new Database(); // make a new database (TODO: idk if this works)

// get handler files and run their functions
const handlerPath = path.join(__dirname, 'handlers'); // handler folder
const handlerFiles = fs.readdirSync(handlerPath).filter(file => file.endsWith('.js')); // array of handler file names (only .js)

// require each handler
for(handler of handlerFiles){
	const handlerFilePath = path.join(handlerPath, handler); // join handler file name and the handler path
	require(handlerFilePath)(client); // dependency interjection so that the module can access the client instance
}

// Login to Discord
client.login(token);