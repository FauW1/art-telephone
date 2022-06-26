// guild data factory function: https://www.codecademy.com/courses/introduction-to-javascript/lessons/advanced-objects/exercises/factory-functions
const path = require('node:path');

const gameDefault = path.join(__dirname, 'gameDefault.js');

const settingsData = (channelId, modRoleId, activeRoleName) => {
  return { //return settings data object
    channel: channelId, // logs channel
    mods: modRoleId,
    activePlayer: activeRoleName,
    default: gameDefault, // server default, created upon instantiation: can be edited, and can also be reverted to default
  };
};

module.exports = settingsData;