const mysql = require("mysql2/promise"); // Use promise-based connection
require("dotenv").config();

// create a new connection to the aws database
const connection = mysql.createPool({
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    database: "2021_democracy_checkup",
    port: process.env.RDS_PORT || 3309, // Default to 3309 if undefined
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });


// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database:', err);
//         return;
//     }
//     console.log('Connected to the database on port:', connection.config.port);
// });


module.exports = connection;


