// event handler
const fs = require('node:fs');
const path = require('node:path');

// this just works after requiring it :0
module.exports = client => {
    const eventsPath = path.join(__dirname, '..', 'events'); // '..' goes to a folder above the current dir (https://www.geeksforgeeks.org/node-js-path-join-method/ , https://stackoverflow.com/questions/30845416/how-to-go-back-1-folder-level-with-dirname)
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    // register these events
    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args)); // event listener created, if the event should only happen once (takes in event args with rest parameter syntax and passes it in with the spread syntax; The rest parameter collects these variable number of arguments into a single array, and the spread syntax then takes these elements and passes them to the execute function.)
        } else {
            client.on(event.name, (...args) => event.execute(...args)); // event listener created, if the event should happen every time
        }
    }
};
