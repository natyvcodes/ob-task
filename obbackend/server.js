const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:nataf2712@localhost:5433/obtasks')

app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.get('/', (req, res) => {
    res.json({ message: 'Hola' });

})
db.one('SELECT name FROM usuario WHERE id = $1', [2]) // Ejecuta la consulta con un ID fijo (1 en este caso)
    .then((data) => {
        console.log('Resultado de la consulta:', data.name); // Muestra el nombre en la consola
    })
    .catch((error) => {
        console.error('Error al realizar la consulta:', error.message); // Muestra el error en consola
    });
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})