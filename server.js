const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',           // Replace with your MySQL username
    password: '',           // Replace with your MySQL password
    database: 'shopkeeper' // Replace with your database name
});

// Use promise-based API for simplicity
const promisePool = pool.promise();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create the inventory table if it doesn't exist
(async () => {
    try {
        await promisePool.query(`
            CREATE TABLE IF NOT EXISTS inventory (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_name VARCHAR(255) NOT NULL,
                quantity INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL
            )
        `);
    } catch (err) {
        console.error("Error creating table:", err.message);
    }
})();

// Routes for handling inventory
app.get('/inventory', async (req, res) => {
    try {
        const [rows] = await promisePool.query('SELECT * FROM inventory');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/inventory', async (req, res) => {
    const { product_name, quantity, price } = req.body;
    try {
        const [result] = await promisePool.query(
            'INSERT INTO inventory (product_name, quantity, price) VALUES (?, ?, ?)',
            [product_name, quantity, price]
        );
        res.json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
