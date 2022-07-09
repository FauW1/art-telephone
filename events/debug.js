// for debugging
module.exports = {
  name: 'debug',
  async execute(info) { //use async because there are awaits
    console.log(info);
  },
};