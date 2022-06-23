// NOTES ON DATABASE
const Database = require("@replit/database");
const db = new Database();

db.set("key", "value").then(() => { console.log('success' + '\n') });
db.set("key1", "value").then(() => { console.log('success') });

db.list("key").then(matches => (console.log(matches)));

const choices = db.list('&').then(matches => { return matches.forEach(match => match.slice(1))}).catch(console.log('oops'));
console.log(choices);
// they are all async, so responses are given as microtasks, unpredictable order