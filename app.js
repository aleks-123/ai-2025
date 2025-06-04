//npm install express dotenv mongoose
const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });
const cors = require('cors');
const db = require('./pkg/db/index');
const { handleChatRequest } = require('./handlers/aiController');
const pochvaController = require('./handlers/pochvaController');
const auth = require('./handlers/authHandler');

const app = express();

app.use(cors());

db.init();

// console.log(process.env);

//middelware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/api/v1/signup', auth.signup);
app.post('/api/v1/login', auth.login);

app.post('/api/v1/ai', handleChatRequest);

app.post('/api/v1/pochva', pochvaController.createPochva);
app.get('/api/v1/pochva', pochvaController.getAllPochvi);
app.post('/api/v1/pochva/samples', pochvaController.addSamplePochvi);
app.post('/api/v1/pochva/chat', pochvaController.chatAboutPochva);

app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.log('Could not start service');
  }
  console.log(`Service started succesfully ${process.env.PORT}`);
});
