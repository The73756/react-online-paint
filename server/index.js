const express = require('express');
const app = express();
const WSserver = require('express-ws')(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('Привет господин! Все системы запущены, ня❤️');
});
