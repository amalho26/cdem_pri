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
    const tables = [
      "confidence", "consent_demographics", "embedded_data", "federal_info", "feedback",
      "financial_status", "fl155_attitudes", "fl160_attitudes", "fl36_attitudes",
      "fl38_attitudes", "fl39_attitudes", "fl46_attitudes", "fl51_attitudes",
      "fl52_attitudes", "fl54_ties", "fl56_participation", "government_efficacy",
      "government_satisfaction", "govt_programs_word", "group_thermometers",
      "immigration", "jurisdiction", "language", "leader_ratings", "media_economic",
      "occupation", "origin", "parental_background", "party_affiliation",
      "political_attitudes", "political_participation_civ", "political_participation_ins",
      "political_participation_pro", "political_preferences", "property", "religion",
      "social_trust", "socioeconomic_status", "survey_flags", "survey_language",
      "visual_minority", "vote_2019"
    ];

    let query = `SELECT * FROM ${req.db}.survey_metadata`;

    tables.forEach((table) => {
      query += ` LEFT JOIN ${req.db}.${table} 
                 ON survey_metadata.responseID = ${table}.responseID`;
    });

    console.log(query);

    const [results] = await req.socket.query(query);
    res.json(results);
  } catch (error) {
    console.error("Error fetching data:", error.sqlMessage || error);
    res.status(500).json({ error: "Failed to execute join query." });
  }
});






// router.post('/fetch-data', (req, res) => {
//   const { table, columns, filters } = req.body;
//   console.log(table)
//   console.log(columns)
//   console.log(filters)

//   if (!table || !columns || !Array.isArray(columns) || columns.length === 0) {
//     return res.status(400).json({ error: 'Invalid request. Table and columns are required.' });
//   }

//   // Build the base query
//   let query = `SELECT ${columns.join(', ')} FROM ${table}`;

//   // Add filters to the query
//   if (filters && filters.length > 0) {
//     const filterConditions = filters.map((filter) => `${columns[0]} = ${filter}`).join(' OR ');
//     query += ` WHERE ${filterConditions}`;
//   }
//   console.log(query);

//   connection.query(query, filters, (err, results) => {
//     if (err) {
//       console.error('Error fetching data:', err);
//       return res.status(500).send('Server error');
//     }
//     res.json(results);
//   });
// });



// router.post('/fetch', (req, res) => {
//   const { table, independent, dependent, filters } = req.body;

//   // Validate required inputs
//   if (!table || !independent) {
//     return res.status(400).json({ error: 'Invalid request. Table and independent variable are required.' });
//   }

//   // Build the base query
//   let query = `SELECT ${independent}, dc22_province`;
//   const queryParams = [];

//   // Add dependent column if provided
//   if (dependent) {
//     query += `, ${dependent}`;
//   }

//   query += ` FROM ${table}`;

//   // Add filters to the WHERE clause if provided
//   const whereClauses = [];
//   if (filters && filters.length > 0) {
//     const filterConditions = filters.map((filter) => `${independent} = ${filter}`).join(' OR ');
//     query += ` WHERE (${filterConditions})`;
//   }

//   // Add a condition for the dependent variable if provided
//   if (dependent) {
//     whereClauses.push(`${dependent} IS NOT NULL`);
//   }

//   // Combine WHERE conditions
//   if (whereClauses.length > 0) {
//     query += ` WHERE ${whereClauses.join(' AND ')}`;
//   }

//   console.log('Final Query:', query);
//   console.log('Query Params:', queryParams);

//   // Execute the query securely
//   connection.query(query, queryParams, (err, results) => {
//     if (err) {
//       console.error('Error fetching data:', err);
//       return res.status(500).send('Server error');
//     }
//     res.json(results);
//   });
// });


module.exports = router;
