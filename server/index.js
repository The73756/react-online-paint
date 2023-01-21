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
        break;
      case 'disconnect':
        broadcastConnection(ws, msg);
        closeHandler(ws, msg);
        break;
    }
  });
});

const closeHandler = (ws, msg) => {
  let currentRoomUsersCount = 0;
  aWss.clients.forEach((client) => {
    if (client.id === msg.id) {
      currentRoomUsersCount++;
    }
  });

  if (currentRoomUsersCount - 1 === 0) {
    setTimeout(() => {
      deleteFile(ws.id);
    }, 300000); // 5 минут
  }
};

app.post('/image', (req, res) => {
  try {
    const data = req.body.img.replace(`data:image/png;base64,`, '');
    fs.writeFileSync(path.resolve(__dirname, 'static', `${req.query.id}.png`), data, 'base64');

    return res.status(200).json({ message: 'Изображение сохранено' });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: e.message });
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
    res.status(500).json({ message: e.message });
  }
});

app.listen(PORT, () => {
  console.log('Привет, господин! Все системы запущены, ня❤️');
});

const deleteFile = (id) => {
  const filePath = path.resolve(__dirname, 'static', `${id}.png`);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

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
