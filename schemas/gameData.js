const path = require('node:path');
const Database = require("@replit/database");

// needed files (using path to ensure it runs on all operating systems)
const gameState = require(path.join(__dirname, 'gameState.js'));

const gameData = (name, settings) => {
  return { //return game data object
    name: name,
    settings: settings, // either pass in default guild settings or a new settings created by mod
    users: [], // empty array until sign ups
    images: [], // empty array for adding images to
    stateNum: 0, // DOES THIS WORK LIKE THAT? TEST
    _state: gameState(stateNum), // 0: queued
    _timeStamp: new Date(), // would this work?
  };
};

module.exports = gameData;