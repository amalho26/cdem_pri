const mysql = require("mysql2/promise"); // Use promise-based connection
require("dotenv").config();

const databases = [
  "2020_democracy_checkup", "2021_democracy_checkup", "2022_democracy_checkup"];

const pools = new Map();

databases.forEach((db) => {
  pools.set(
    db,
    mysql.createPool({
      host: process.env.RDS_HOST,
      user: process.env.RDS_USER,
      password: process.env.RDS_PASSWORD,
      database: db, 
      port: process.env.RDS_PORT || 3309,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })
  );
});

const getDb = (db) => {
  return pools.get(db) || null;
};



module.exports = {pools, getDb};


