const fs = require('fs');
const path = require('path');
const Pool = require('pg').Pool;
const fileName = './database.csv';
const dotenv = require('dotenv');
const { parse } = require('csv-parse');
const csvFilePath = path.join(__dirname, fileName);

dotenv.config();
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
});

async function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const records = [];

    // Initialize the parser
    const parser = parse({
      delimiter: ',',
    });

    // Handle the 'readable' event to consume records
    parser.on('readable', function () {
      let record;
      while ((record = parser.read())) {
        records.push(record);
      }
    });

    // Handle the 'end' event to resolve the promise
    parser.on('end', function () {
      resolve(records);
    });

    // Handle errors during parsing
    parser.on('error', function (error) {
      reject(error);
    });

    // Use the readable stream API to consume records
    const fileStream = fs.createReadStream(filePath);

    // Handle errors during file reading
    fileStream.on('error', function (error) {
      reject(error);
    });

    // Handle the 'finish' event to indicate the end of the stream
    fileStream.on('finish', function () {
      // The stream has finished, and the parser will emit the 'end' event
      parser.end();
    });

    fileStream.pipe(parser);
  });
}

// Function to drop the t_university_programs table
const dropTable = async () => {
  try {
    console.log('Dropping t_university_programs table...');
    const dropTableQuery = 'DROP TABLE IF EXISTS t_university_programs';
    await pool.query(dropTableQuery);
    console.log('Table dropped successfully.');
  } catch (error) {
    console.error('Error dropping table:', error.message);
  }
};

const setupDatabase = async () => {
  try {
    // Connect to the main database
    await pool.connect();

    // Create table if not exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS t_university_programs (
        id SERIAL PRIMARY KEY,
        academic_level VARCHAR(255),
        program_name VARCHAR(255),
        program_type VARCHAR(255),
        program_duration VARCHAR(255),
        duration_of_term VARCHAR(255),
        institution_name VARCHAR(255),
        contact_person VARCHAR(255),
        contact_email VARCHAR(255)
      )
    `;
    await pool.query(createTableQuery);

    // Check if the table is empty (assuming ID is the primary key)
    const checkTableQuery = 'SELECT COUNT(*) FROM t_university_programs';
    const result = await pool.query(checkTableQuery);

    // If the table is empty, import data from CSV
    if (result.rows[0].count === '0') {
      console.log(`Importing data from CSV file: ${csvFilePath}`);
      const records = await parseCSV(csvFilePath);

      // Use a transaction for atomicity (either all universities are added or none)
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        for (const universityData of records) {
          const [
            academic_level,
            program_name,
            program_type,
            program_duration,
            duration_of_term,
            institution_name,
            contact_person,
            contact_email,
          ] = universityData;

          const insertQuery = `
            INSERT INTO t_university_programs (
              academic_level, program_name, program_type, program_duration,
              duration_of_term, institution_name, contact_person, contact_email
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          `;
          const values = [
            academic_level,
            program_name,
            program_type,
            program_duration,
            duration_of_term,
            institution_name,
            contact_person,
            contact_email,
          ];

          await client.query(insertQuery, values);
        }

        await client.query('COMMIT');
        console.log('Data imported successfully.');
      } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error importing data:', error.message);
      } finally {
        client.release();
      }
    }

    console.log('Database setup complete.');
  } catch (error) {
    console.error('Error during database setup:', error.message);
    pool.end();
  }
};

// Drop the table before initialization
//dropTable();
// Run the setup function
setupDatabase();

module.exports = pool;