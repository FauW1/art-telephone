const path = require('node:path');

// needed files (using path to ensure it runs on all operating systems)
const settingsData = require(path.join(__dirname, 'settingsData.js'));
const gameState = require(path.join(__dirname, 'gameState.js'));

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