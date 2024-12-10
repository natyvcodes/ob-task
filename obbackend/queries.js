const { response, request } = require('express');
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:nataf2712@localhost:5433/obtasks')
const bcryptjs = require('bcryptjs'); const jwt = require('jsonwebtoken');

const addTask = (request, response) => {
    const { name, description, user_id, id_state, id_category } = request.body;
    if (!name || !description || !user_id || !id_state || !id_category) {
        return response.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    db.any('INSERT INTO task (name, description, user_id, id_state, id_category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, user_id, id_state, id_category])
        .then(results => {
            response.status(201).json(results);
        })
        .catch(error => {
            response.status(500).send(`Error adding task: ${error.message}`);
        });
};

const getCategories = (request, response) => {
    db.any('SELECT * FROM category').then(results => {
        response.status(200).json(results);
    }).catch(error => {
        console.error(error);
        response.status(500).json({ error: 'Algo salió mal al obtener las categorias' });
    })
}
const getStates = (request, response) => {
    db.any('SELECT * FROM states').then(results => {
        response.status(200).json(results);
    }).catch(error => {
        console.error(error);
        response.status(500).json({ error: 'Algo salió mal al obtener las categorias' });
    })
}
const authUser = async (request, response) => {
    const { email, password } = request.body;
    if (!email || !password) {
        return response.status(400).json({ message: 'Email and password are required' });
    }
    try {
        const user = await db.oneOrNone('SELECT email, password, name, id FROM usuario WHERE email = $1', [email]);
        if (!user) {
            return response.status(401).json({ message: 'Invalid email or password' });
        }
        const passwordMatch = await bcryptjs.compare(password, user.password);
        if (!passwordMatch) {
            return response.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        response.status(200).json({ message: 'User authenticated', token, name: user.name, id: user.id });
    } catch (error) {
        console.error('Error during authentication:', error);
        response.status(500).send(`Error during authentication: ${error.message}`);
    }
};
const getUserTasks = async (request, response) => {
    const { id } = request.body;
    if (!id) {
        return response.status(400).json({ message: 'User ID is required' });
    }
    try {
        const tasks = await db.any('SELECT * FROM task WHERE user_id = $1', [id]);
        response.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        response.status(500).json({ message: `Error fetching tasks: ${error.message}` });
    }
};

module.exports = {
    addTask,
    getCategories,
    getStates,
    authUser,
    getUserTasks
}