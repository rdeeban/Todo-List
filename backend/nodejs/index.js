const express = require('express');
const cors = require('cors');
const Pool = require('pg').Pool
const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT
});

const app = express();
app.use(cors({
    origin: 'http://localhost:3000' // Replace with your React app's origin
}));
const port = 3001;

const createTableQuery = `
    CREATE TABLE IF NOT EXISTS todo_items (
        id          SERIAL PRIMARY KEY,
        name        VARCHAR(80),
        timestamp   BIGINT
    );
`;

async function initializeDatabase() {
    try {
        const client = await pool.connect();
        await client.query(createTableQuery);
        console.log('Table created successfully!');
        client.release();
    } catch (err) {
        console.error('Error creating table:', err);
    }
}

initializeDatabase();

app.use(express.json());

app.get('/api/todos', (req, res) => {
    pool.query('SELECT * FROM todo_items ORDER BY id ASC', (error, results) => {
        if (error) throw error;
        const page = req.query.page;
        const quantity = req.query.quantity;
        const i = (page - 1) * quantity;
        const j = page * quantity;
        let resultSet = []
        for (let k = i; k < j; k ++) {
            if (results.rows[k]) resultSet.push(results.rows[k]);
        }

        res.json(resultSet);
    });
});

app.post('/api/todo', (req, res) => {
    const { name, timestamp } = req.body;
    pool.query('INSERT INTO todo_items (name, timestamp) VALUES ($1, $2)', [name, timestamp], (error, _) => {
        if (error) throw error;
        pool.query('SELECT id, name FROM todo_items WHERE name = $1 and timestamp = $2', [name, timestamp], (error, results) => {
            if (error) throw error;
            res.json({"id": results.rows[0].id});
        });
    });
});

app.delete('/api/todo', (req, res) => {
    const id = parseInt(req.query.id);
    pool.query('DELETE FROM todo_items WHERE id = $1', [id], (error, _) => {
        if (error) throw error;
        res.send({"message": "The TODO item was successfully deleted."})
    });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});