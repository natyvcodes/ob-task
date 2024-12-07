const { response } = require('express');
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:nataf2712@localhost:5433/obtasks')



const getUser = (request, response) => {
    db.any('SELECT * FROM task').then(results => {
        response.status(200).json(results);
    }).catch(error => {
        console.error(error);
        response.status(500).json({ error: 'Algo salió mal al obtener los usuarios' });
    });
}
const addTask = (request, response) => {
    const { name, description, user_id, id_state, id_category } = request.body;
    db.any('INSERT INTO task (name, description, user_id, id_state, id_category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, user_id, id_state, id_category]).then(results => {
            response.status(201).json({ message: 'Task added successfully', task: results[0] });;
        }).catch(error => { response.status(500).send(`Error adding task: ${error.message}`); });
}
const getCategories = (request, response) => {
    db.any('SELECT * FROM category_type').then(results => {
        response.status(200).json(results);
    }).catch(error => {
        console.error(error);
        response.status(500).json({ error: 'Algo salió mal al obtener las categorias' });
    })
}
const getStates = (request, response) => {
    db.any('SELECT * FROM state_type').then(results => {
        response.status(200).json(results);
    }).catch(error => {
        console.error(error);
        response.status(500).json({ error: 'Algo salió mal al obtener las categorias' });
    })
}
module.exports = {
    getUser,
    addTask,
    getCategories,
    getStates
}