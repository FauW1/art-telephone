const path = require('node:path');

// needed files (using path to ensure it runs on all operating systems)
const gameState = require(path.join(__dirname, 'gameState.js'));

const gameData = (name, settings, messageId) => {
  return { //return game data object
    name: name,
    settings: settings, // either pass in default guild game settings object or a new settings object created by mod
    messageId: messageId,
    _users: [], // empty array until sign ups (stores art telephone players who have not played yet); will store array of user data objects
    _done: [], // users done

    // GETTERS AND SETTERS
    userDone(userId) { // move user from available users to finished
      // find https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
      const foundUser = this._users.find(user => user.userId === userId); // find the user

      if(!foundUser){
        console.error('User not found');
        return;
      }

      this._done.push(foundUser); // add found user to the array of users who have completed their art

      foundUserI = this._users.indexOf(foundUser); // the found user's index
      this._users.splice(foundUserI, 1); // remove the found user from the available array

      return foundUser; // returns the info about the user found
    },
    
    // REMOVED: MOVE TO USER OBJECT -> _urls: [], // empty array for adding attachment/image URLs to
    _state: gameState(0), // 0: 'Queued'
    _timeStamp: new Date(), // would this work?
    
    // TODO: TEST IF IT WORKS? UNKNOWN THIS.
    // GETTERS AND SETTERS
    get users() {
      return this._users;
    },
    
    set users(newUser) {
      if(newUser.isArray){ // if it is an array
        this._users = [this._users, ...newUser]; // spread syntax to combine the arrays 
      } else {
        this._users.push(newUser); // add the single element
      }
    },

    get done() {
      return this._done;
    },
    
    get state() {
      return this._state;
    },
    
    set state(num){ // set the state based on input number
      this._state = gameState(num);
    },

    get timeStamp() {
      return this._timeStamp;
    },
  };
};

module.exports = gameData;