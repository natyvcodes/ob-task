const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http');
require('dotenv').config();

const db = require('../src/queries');

const app = express();

app.use(cors({
  origin: 'https://obtask.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.options('*', cors());


app.get('/', (req, res) => res.json({ message: 'Hola' }));
app.post('/addTask', db.addTask);
app.get('/categories', db.getCategories);
app.get('/states', db.getStates);
app.post('/login', db.authUser);
app.post('/userTasks', db.getUserTasks);
app.post('/registerUser', db.registerUser);
app.post('/deleteTask', db.deleteTask);
app.post('/updateTask', db.updateTask);
app.post('/deleteUser', db.deleteUser);


module.exports = serverless(app);
