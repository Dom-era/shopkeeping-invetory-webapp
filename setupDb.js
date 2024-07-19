const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
    host: 'localhost',       // Your MySQL host
    user: 'root',   // Your MySQL username
    password: '', // Your MySQL password
    database: 'shopkeeper' // Your database name
});

// Connect to the database
connection.connect(err => {
    if (err) {
        return console.error('Error connecting to the database: ' + err.stack);
    }
    console.log('Connected to the database.');

    // Create the inventory table
    const createInventoryTable = `
        CREATE TABLE IF NOT EXISTS inventory (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_name VARCHAR(255) NOT NULL,
            quantity INT NOT NULL,
            price DECIMAL(10, 2) NOT NULL
        )
    `;

    // Create the sales table
    const createSalesTable = `
        CREATE TABLE IF NOT EXISTS sales (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            quantity INT NOT NULL,
            sale_date DATETIME NOT NULL,
            FOREIGN KEY (product_id) REFERENCES inventory(id)
        )
    `;

    // Create the customers table
    const createCustomersTable = `
        CREATE TABLE IF NOT EXISTS customers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            contact_info VARCHAR(255) NOT NULL
        )
    `;

    // Execute queries to create tables
    connection.query(createInventoryTable, (err, results) => {
        if (err) {
            console.error('Error creating inventory table: ' + err.stack);
        } else {
            console.log('Inventory table created successfully.');
        }
    });

    connection.query(createSalesTable, (err, results) => {
        if (err) {
            console.error('Error creating sales table: ' + err.stack);
        } else {
            console.log('Sales table created successfully.');
        }
    });

    connection.query(createCustomersTable, (err, results) => {
        if (err) {
            console.error('Error creating customers table: ' + err.stack);
        } else {
            console.log('Customers table created successfully.');
        }
    });

    // Close the database connection
    connection.end(err => {
        if (err) {
            console.error('Error ending the connection: ' + err.stack);
        } else {
            console.log('Connection ended.');
        }
    });
});
