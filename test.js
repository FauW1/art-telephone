// for seeing values in the database
const Database = require("@replit/database");
const db = new Database();

db.list().then(keys => {
  let count = 0;
  for (key of keys){
    count ++;
    db.get(key).then(value => console.log(`${count}[${key}] \n ${JSON.stringify(value, null, 4)}`)); // displays key value pairs :) from (https://stackoverflow.com/questions/957537/how-can-i-display-a-javascript-object)
  }
})
  // .then(db.delete('981108806920581170')); // delete the testing server data 

