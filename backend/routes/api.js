const express = require('express');
const router = express.Router();
const { connection, getDb, pools } = require("../db/connection");



// Middleware to validate and set the database connection
router.use((req, res, next) => {
  req.db = req.headers["db"]; // Extract database name from request header

  if (!req.db) {
    return res.status(400).json({ error: "Database name is required in the 'db' header." });
  }

  
  req.socket = getDb(req.db);
  if (!req.socket) {
    return res.status(400).json({ error: "Invalid database name." });
  }

  next();
});



// Simple route to join all tables on survey_metadata.responseID
router.get("/all_data", async (req, res) => {
  try {

    console.log(req.db)
    const tableQuery = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = '${req.db}'
  `;
  const tableResults = await req.socket.query(tableQuery);

  // Map results to an array of table names and filter out 'survey_metadata'
  const tables = tableResults[0].map(row => row.TABLE_NAME).filter(table => table !== 'survey_metadata'); // Exclude metadata table if needed
    

    let query = `SELECT * FROM ${req.db}.survey_metadata`;

    tables.forEach((table) => {
      query += ` LEFT JOIN ${req.db}.${table} 
                 ON survey_metadata.responseID = ${table}.responseID`;
    });

    //console.log(query);

    const [results] = await req.socket.query(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching data:", error.sqlMessage || error);
    res.status(500).json({ error: "Failed to execute join query." });
  }
});

module.exports = router;
