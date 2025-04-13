const express = require('express');
const app = express();
const { port } = require('./config');
const apiRouters = require('./routers/api');
const cors = require('cors');

require('./db/db');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiRouters);
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
  }));

app.post('/registration', apiRouters);
app.post('/login', apiRouters);
app.post('/editProfile', apiRouters);
app.get('/getProfile', apiRouters);

app.listen(port, () => {
    console.log('Serwer działa na porcie: ' + port);
});

module.exports = app;
