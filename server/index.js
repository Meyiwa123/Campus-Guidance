const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db');

// middleware
app.use(cors());
app.use(express.json());

// routes
// POST route to get recommended programs
app.post('/api/submit-form-data', async (req, res) => {
  try {
    const {
      academicLevel,
      institutionInterest,
      programName,
      programType,
      programDuration
    } = req.body;

    const query = `
      SELECT * FROM t_university_programs
      WHERE
        ${academicLevel ? 'academic_level ILIKE CAST($1 AS TEXT) AND' : ''}
        ${institutionInterest ? 'institution_name ILIKE CAST($2 AS TEXT) AND' : ''}
        ${programName ? 'program_name ILIKE CAST($3 AS TEXT) AND' : ''}
        ${programType ? 'program_type = $4 AND' : ''}
        ${programDuration ? 'program_duration < $5 AND' : ''}
        1=1;`;

    const params = [
      academicLevel ? `%${academicLevel}%` : null,
      institutionInterest ? `%${institutionInterest}%` : null,
      programName ? `%${programName}%` : null,
      programType || null,
      programDuration || null
    ].filter(Boolean); // Remove null values

    const recommended_programs = await pool.query(query, params);
    res.json(recommended_programs.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET route to get all distinct program names
app.get('/api/v1/program-names', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT program_name FROM t_university_programs');
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET route to get all distinct program types
app.get('/api/v1/all-program-types', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT program_type FROM t_university_programs');
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET route to get all distinct program durations
app.get('/api/v1/program-durations', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT program_duration FROM t_university_programs');
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET route to get all distinct academic levels
app.get('/api/v1/all-academic-levels', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT academic_level FROM t_university_programs');
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET route to get all distinct institution names
app.get('/api/v1/all-institutions', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT institution_name FROM t_university_programs');
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to drop the t_university_programs table
app.post('/api/v1/dropTable', async (req, res) => {
  try {
    console.log('Dropping t_university_programs table...');
    const dropTableQuery = 'DROP TABLE IF EXISTS t_university_programs';
    await pool.query(dropTableQuery);
    console.log('Table dropped successfully.');
    res.status(200).json({ message: 'Table dropped successfully.' });
  } catch (error) {
    console.error('Error dropping table:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.SERVER_PORT}`);
});