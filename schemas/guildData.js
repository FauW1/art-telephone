// guild data factory function: https://www.codecademy.com/courses/introduction-to-javascript/lessons/advanced-objects/exercises/factory-functions
const path = require('node:path');

const settingsData = require(path.join(__dirname, 'settingsData.js')); // settings data path

const guildData = () => {
  return { //return guild data object
    // add settings property upon setup
    settings: settingsData(null, null, null, null), // null values for settings
    active: null,
    queued: null,
    completed: null,
  };
};

module.exports = guildData;