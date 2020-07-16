const io = require("socket.io-client");
const chalk = require("chalk");
const readline = require("readline");

//Connect this client to the server
const socket = io.connect("http://localhost:8124");

// Initialize the readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "::>> ",
});

// Get the user's name and resolve the input once received
const namePromise = new Promise((resolve, reject) => {
  rl.question("::>> What is your name? \n", (input) => {
    resolve(input);
    console.log(chalk.bgRed("Type anything to begin conversation!"));
    console.log(`------------ ${input} has joined the chat ------------`);
  });
});

// Set the user's name and add a listener to start sending messages
namePromise.then((name) => {
  socket.emit("setName", name);
  rl.on("line", (input) => {
    if (input !== "") {
      socket.send(input);
    }
  });
});

rl.on("close", () => {
  console.log("Closing the Readline interface.");
});

socket.on("connect", () => {
  socket.emit("addClient");
});

socket.on("message", (data) => console.log(chalk.blue(data)));
