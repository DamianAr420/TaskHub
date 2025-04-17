require('dotenv').config();
const express = require('express');
const app = express();
const { port } = require('./config');
const apiRouters = require('./routers/api');
const cors = require('cors');

require('./db/db');

app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouters);

app.listen(port, () => {
  console.log('Serwer działa na porcie: ' + port);
});

module.exports = app;
