// Require necessary files
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// Use environment variables
const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const path = require('node:path');
const fs = require('node:fs');

// commands path
const commandPath = path.join(__dirname, 'commands'); //using path makes sure this works on all operating systems

// Find all commands
const commands = [];
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const commandFilePath = path.join(commandPath, file);
	const command = require(commandFilePath);
	// create a JSON key-value doc from command data, add it to commands array
	commands.push(command.data.toJSON()); 
}

// Register the commands
const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

    await rest.put(
    	Routes.applicationGuildCommands(clientId, guildId),
    	{ body: commands },
    );

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

// Use Routes.applicationCommands(clientId) to register global commands (NOTE: global commands take ONE HOUR to update)