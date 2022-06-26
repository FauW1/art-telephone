//DEFAULT settings for a game

module.exports = { // default game settings object
    order: false, // false is randomized, true is mod controlled
    time: 1, // (1 day, 24x 60 x 60 x 1000)
    units: 'day(s)', // TODO: consider making a switch statement for this too? otherwise the other units should be week(s), hour(s), minute(s), second(s)
    check: true, // true means mods will have to approve art before it is sent to the next person
    autoApprove: false, // false means the players need to request to swap/extend/resubmit
    channel: null, // no channel, throw error?
};