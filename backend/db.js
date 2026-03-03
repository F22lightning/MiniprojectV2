const mysql = require('mysql2/promise');

// Create a connection pool to the database
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'database', // Matches the service name in docker-compose.yml
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'testdb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
