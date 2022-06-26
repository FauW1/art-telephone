const settingsData = require('./settingsData.js');
const gameState = require('./gameState.js');

const gameData = (name) => {
  return { //return game data object
    name: name,
    settings: settingsData(null, null, null, null), // just a placeholder
    users: [], // empty array until sign ups
    images: [], // empty array for adding images to
    state: gameState(0), // 0: queued
  };
};

module.exports = gameData;