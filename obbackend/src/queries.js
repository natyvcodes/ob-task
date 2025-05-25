const { response, request } = require('express');
const pgp = require('pg-promise')();
const dbConfig = {
    host: 'ep-tiny-forest-a86ntsxo-pooler.eastus2.azure.neon.tech',
    port: 5432,
    database: 'neondb',
    user: 'neondb_owner',
    password: 'npg_N4RLOnp0beWv',
    ssl: {
        rejectUnauthorized: false
    }
};

const db = pgp(dbConfig);
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
            return response.status(401).json({ message: 'User does not exist' });
        }
        const passwordMatch = await bcryptjs.compare(password, user.password);
        if (!passwordMatch) {
            return response.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        response.status(200).json({ message: 'User authenticated', token, name: user.name, id: user.id, email: user.email});
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
const registerUser = (request, response) => {
    const { name, email, password } = request.body;
    if (!name || !email || !password) {
        return response.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    db.any("INSERT INTO usuario (name, email, password) VALUES ($1, $2, crypt($3, gen_salt('bf'))) RETURNING *",
        [name, email, password])
        .then(results => {
            response.status(201).json(results);
        })
        .catch(error => {
            response.status(500).send(`Error adding user: ${error.message}`);
        });
}
const deleteTask = async (request, response) => {
    const { id } = request.body;
    if (!id) { 
        return response.status(400).json({ message: "Invalid or missing task ID" });
    }
    try {
        const result = await db.result("DELETE FROM task WHERE id = $1", [id]);
        if (result.rowCount === 0) { 
            return response.status(404).json({ message: "Task not found" });
        }
        return response.status(200).json({id});
    } catch (error) {
        return response.status(500).json({ message: "Error deleting task", error: error.message });
    }
}
const deleteUser = async (request, response) => {
    const { id } = request.body;
    if (!id) { 
        return response.status(400).json({ message: "Invalid or missing user ID" });
    }
    try {
        const result = await db.result("DELETE FROM usuario WHERE id = $1", [id]);
        if (result.rowCount === 0) { 
            return response.status(404).json({ message: "User not found" });
        }
        return response.status(200).json({id});
    } catch (error) {
        return response.status(500).json({ message: "Error deleting users", error: error.message });
    }
}
const updateTask = async (request, response) => {
    const { id, name, description, id_state, id_category} = request.body;
    if (!id || !name || !description || !id_state || !id_category) {
        return response.status(400).json({ message: "All fields are required" });
    }    
    try {
        const result = await db.result("UPDATE task SET name = $1, description = $2, id_state = $3, id_category = $4 WHERE id = $5",
            [name, description,id_state, id_category, id ]
        )
        return response.status(200).json({
            id,
            name,
            description,
            id_state,
            id_category
        })
    } catch (error) {
        return response.status(500).json({ message: "Error updating task", error: error.message });
    }
}

module.exports = {
    addTask,
    getCategories,
    getStates,
    authUser,
    getUserTasks,
    registerUser,
    deleteTask,
    updateTask,
    deleteUser
}