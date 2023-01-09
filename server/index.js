const express = require('express');
const app = express();
const Wss = require('express-ws')(app);
const aWss = Wss.getWss();
const PORT = process.env.PORT || 5000;

app.ws('/', (ws) => {
  ws.on('message', (msg) => {
    msg = JSON.parse(msg);
    switch (msg.method) {
      case 'connection':
        connectionHandler(ws, msg);
        break;
    }
  });
});

app.listen(PORT, () => {
  console.log('Привет, господин! Все системы запущены, ня❤️');
});

const connectionHandler = (ws, msg) => {
  ws.id = msg.id;
  broadcastConnection(ws, msg);
};

const broadcastConnection = (ws, msg) => {
  aWss.clients.forEach((client) => {
    if (client.id === msg.id) {
      client.send(`Пользователь ${msg.username} подключился`);
    }
  });
};
