require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const db = require('./src/queries');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'https://obtask.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.get('/', (req, res) => {
  res.json({ message: 'Hola desde Express en Vercel' });
});
app.post('/addTask', db.addTask)
app.get('/categories', db.getCategories)
app.get('/states', db.getStates)
app.post('/login', db.authUser)
app.post('/userTasks', db.getUserTasks)
app.post('/registerUser', db.registerUser)
app.post('/deleteTask', db.deleteTask)
app.post('/updateTask', db.updateTask)
app.post('/deleteUser', db.deleteUser)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

