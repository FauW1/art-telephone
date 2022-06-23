/*
From https://replit.com/@BeauCarnes/Encourage-Bot-JS#server.js
*/

// Require the express library
const express = require("express");

// Create a server with express
const server = express();

// Responds to all HTTP requests
server.all("/", (req, res) => {
  res.send("Bot is running!");
})

// Keeps repl.it instance alive
function keepAlive() {
  server.listen(3000, () => {
    console.log("Server is running.");
  })
}

//export to be used in index.js
module.exports = keepAlive;