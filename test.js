/*
// for testing truthy and falsyness of values
const testObj = {};
if(testObj){
  console.log(true); 
} else{
  console.log(false);
} // an empty object returns true ;-;
*/

// for seeing values in the database
const Database = require("@replit/database");
const db = new Database();

const testingGuild = process.env['GUILD_ID'];

db.list().then(keys => {
  let count = 0;
  for (key of keys){
    count ++;
    db.get(key).then(value => console.log(`${count}* [${key}] \n ${JSON.stringify(value, null, 4)}`)); // displays key value pairs :) from (https://stackoverflow.com/questions/957537/how-can-i-display-a-javascript-object)
  }
})
  // .then(db.delete(testingGuild)); // delete the testing server data 