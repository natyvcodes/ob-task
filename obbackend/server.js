require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const db = require('./queries');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.get('/', (req, res) => {
    res.json({ message: 'Hola' });

})
app.get('/users',db.getUser)
app.post('/addTask', db.addTask)
app.get('/categories', db.getCategories)
app.get('/states', db.getStates)
app.post('/login', db.authUser)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})