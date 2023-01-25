const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Wss = require('express-ws')(app);
const aWss = Wss.getWss();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));

let users = [];

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});

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

app.post('/login', (req, res) => {
  try {
    const { username, id } = req.body;
    const currentUser = users.filter((user) => user.id === id && user.username === username);

    if (currentUser.length) {
      res.status(401).json({ message: 'Пользователь с таким именем уже есть!' });
      return;
    }

    users.push({ username, id });
    const connectedUsers = users.filter((user) => user.id === id);
    const response = { isLogin: true, message: 'Подключено', users: connectedUsers };
    res.status(200).json(response);
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

const closeHandler = (ws, msg) => {
  deleteUser(msg);

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

const deleteUser = (msg) => {
  const currentUserIndex = users.findIndex(
    (user) => user.id === msg.id && user.username === msg.username,
  );
  users.splice(currentUserIndex, 1);
};
