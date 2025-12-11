const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Test database connection
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, message: 'Database connected', timestamp: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all entities of a type
app.get('/api/entities/:entityType', async (req, res) => {
  try {
    const { entityType } = req.params;
    const result = await pool.query(
      'SELECT * FROM entities WHERE entity_type = $1 ORDER BY created_at DESC',
      [entityType]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create entity
app.post('/api/entities', async (req, res) => {
  try {
    const { entity_type, data } = req.body;
    const result = await pool.query(
      'INSERT INTO entities (entity_type, data) VALUES ($1, $2) RETURNING *',
      [entity_type, JSON.stringify(data)]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update entity
app.put('/api/entities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;
    const result = await pool.query(
      'UPDATE entities SET data = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [JSON.stringify(data), id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete entity
app.delete('/api/entities/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM entities WHERE id = $1', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`Database: ${process.env.DATABASE_URL}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  pool.end();
  process.exit(0);
});