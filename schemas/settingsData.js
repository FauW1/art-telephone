// guild data factory function: https://www.codecademy.com/courses/introduction-to-javascript/lessons/advanced-objects/exercises/factory-functions

const settingsData = (channelId, modRoleId, playerRoleId, activeId) => {
  return { //return settings data object
    channel: channelId,
    mods: modRoleId,
    player: playerRoleId,
    activePlayer: activeId
  };
};

module.exports = settingsData;