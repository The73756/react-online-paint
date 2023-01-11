const express = require('express');
const app = express();
const Wss = require('express-ws')(app);
const aWss = Wss.getWss();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.ws('/', (ws) => {
  ws.on('message', (msg) => {
    msg = JSON.parse(msg);
    switch (msg.method) {
      case 'connection':
        connectionHandler(ws, msg);
        break;
      case 'draw':
        broadcastConnection(ws, msg);
        break;
    }
  });
});

app.post('/image', (req, res) => {
  try {
    const data = req.body.img.replace(`data:image/png;base64,`, '');
    fs.writeFileSync(path.resolve(__dirname, 'static', `${req.body.fileName}.png`), data, 'base64');
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Что-то пошло не так' });
  }
});

app.get('/image', (req, res) => {
  try {
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Что-то пошло не так' });
  }
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
      client.send(JSON.stringify(msg));
    }
  });
};
