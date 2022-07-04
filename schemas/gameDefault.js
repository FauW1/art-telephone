//DEFAULT settings for a game

const gameDefault = (channel) => { // default game settings object
  return {
    order: false, // false is randomized, true is mod controlled
    duration: 1, // (1 day, 24x 60 x 60 x 1000)
    _unit: 'day',
    check: true, // true means mods will have to approve art before it is sent to the next person
    autoApprove: false, // false means the players need to request to swap/extend/resubmit
    channel: channel, // no channel, throw error?

    // GETTERS AND SETTERS
    get units(){
      return this._unit;
    },
    set units(num){ // use numbers to set units
      switch(num){
        case 0:
          return 'sec';
        case 1:
          return 'min';
        case 2:
          return 'hr';
        case 3:
          return 'day';
        case 4:
          return 'wk';
        default:
          return 'day';
      }
    },
  }
};

module.exports = gameDefault;