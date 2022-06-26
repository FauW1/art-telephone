// guild data factory function: https://www.codecademy.com/courses/introduction-to-javascript/lessons/advanced-objects/exercises/factory-functions

const guildData = (settings) => {
  return { //return guild data object
    settings: settings, // settings object for the guild
    active: null,
    queued: null,
    completed: null,
  };
};

module.exports = guildData;