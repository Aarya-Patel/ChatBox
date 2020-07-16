const net = require("net");
const http = require("http");
const socket = require("socket.io");

let clients = [];
const server = http.createServer().listen(8124);

const io = socket(server);

io.on("connection", (socket) => {
  console.log("Connection made by socket", socket.id);

  // Add the client upon connection
  socket.on("addClient", () => {
    clients.push({ id: socket.id, name: null });
    console.log(clients);
  });

  // Set the name of the client and update the clients array
  socket.on("setName", (name) => {
    clients = clients.map((client) => {
      return client.id === socket.id
        ? { ...client, name: name }
        : { ...client };
    });
  });

  // Remove the client from the array upon disconnection
  socket.on("disconnect", () => {
    clients.pop(socket.id);
    console.log(clients);
  });

  socket.on("message", (data) => {
    const { broadcast } = socket;
    let senderName;
    for (let i = 0; i < clients.length; i++) {
      if (clients[i].id === socket.id) {
        senderName = clients[i].name;
      }
    }
    console.log(senderName);
    broadcast.send(`${senderName}: ${data.trim()}`);
  });
});
