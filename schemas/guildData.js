// guild data factory function: https://www.codecademy.com/courses/introduction-to-javascript/lessons/advanced-objects/exercises/factory-functions

const guildData = (settings) => {
  return { //return guild data object
    settings: settings, // settings object for the guild
    _active: [],
    _queued: [],
    _completed: [],

    /*
    // GETTERS AND SETTERS
    get active() {
      return this._active;
    },
    set active(gameData) {
      this._active.push(gameData);
    },
    get queued() {
      return this._queued;
    },
    set queued(gameData) {
      this._queued.push(gameData);
    },
    get completed() {
      return this.completed;
    },
    set completed(gameData) {
      this._completed.push(gameData);
    },*/
  };
};

module.exports = guildData;