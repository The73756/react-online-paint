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
      case 'release_figure':
        broadcastConnection(ws, msg);
        break;
      case 'undo':
        broadcastConnection(ws, msg);
        break;
      case 'redo':
        broadcastConnection(ws, msg);
        break;
      case 'clear':
        broadcastConnection(ws, msg);
    }
  });
});

app.post('/image', (req, res) => {
  try {
    const data = req.body.img.replace(`data:image/png;base64,`, '');
    fs.writeFileSync(path.resolve(__dirname, 'static', `${req.query.id}.png`), data, 'base64');

    return res.status(200).json({ message: 'Изображение сохранено' });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Что-то пошло не так' });
  }
});

app.get('/image', (req, res) => {
  const filePath = path.resolve(__dirname, 'static', `${req.query.id}.png`);

  try {
    if (fs.existsSync(filePath)) {
      const file = fs.readFileSync(filePath);
      const data = `data:image/png;base64,${file.toString('base64')}`;
      res.json(data);
    } else {
      res.json(null);
    }
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
