/**
* Define all possible game states
* @param stateNum 0 is Queued, 1 is In Progress, 2 is Pending Approval, 3 is All Drawings Complete, 4 is Closed
*/

const gameState = (stateNum) => {
  switch (stateNum) {
    case 0:
      return 'Queued';
    case 1:
      return 'In Progress';
    case 2:
      return 'Pending Approval';
    case 3:
      return 'All Drawings Complete';
    case 4:
      return 'Closed';
    default:
      return 'Error';
  }
};

module.exports = gameState;