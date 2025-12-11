import express from 'express';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', message: 'Database connection successful' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Get all entities by type
app.get('/api/entities/:entityType', async (req, res) => {
  try {
    const { entityType } = req.params;
    const { orderBy } = req.query;

    let query = 'SELECT * FROM entities WHERE entity_type = $1';
    
    if (orderBy) {
      query += ` ORDER BY ${orderBy}`;
    }

    const result = await pool.query(query, [entityType]);
    
    // Transform rows to include parsed JSON data
    const entities = result.rows.map(row => ({
      id: row.id,
      ...row.data,
      created_at: row.created_at,
      updated_at: row.updated_at,
    }));

    res.json(entities);
  } catch (error) {
    console.error('Error fetching entities:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create a new entity
app.post('/api/entities/:entityType', async (req, res) => {
  try {
    const { entityType } = req.params;
    const data = req.body;

    const query = `
      INSERT INTO entities (entity_type, data, created_at, updated_at)
      VALUES ($1, $2, NOW(), NOW())
      RETURNING *
    `;

    const result = await pool.query(query, [entityType, JSON.stringify(data)]);
    const row = result.rows[0];

    const entity = {
      id: row.id,
      ...row.data,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };

    res.status(201).json(entity);
  } catch (error) {
    console.error('Error creating entity:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update an entity
app.put('/api/entities/:entityType/:id', async (req, res) => {
  try {
    const { entityType, id } = req.params;
    const data = req.body;

    const query = `
      UPDATE entities
      SET data = $1, updated_at = NOW()
      WHERE id = $2 AND entity_type = $3
      RETURNING *
    `;

    const result = await pool.query(query, [JSON.stringify(data), id, entityType]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    const row = result.rows[0];
    const entity = {
      id: row.id,
      ...row.data,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };

    res.json(entity);
  } catch (error) {
    console.error('Error updating entity:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete an entity
app.delete('/api/entities/:entityType/:id', async (req, res) => {
  try {
    const { entityType, id } = req.params;

    const query = 'DELETE FROM entities WHERE id = $1 AND entity_type = $2 RETURNING id';
    const result = await pool.query(query, [id, entityType]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    res.json({ success: true, id: parseInt(id) });
  } catch (error) {
    console.error('Error deleting entity:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Database: ${process.env.DATABASE_URL?.split('@')[1] || 'Not configured'}`);
  console.log(`🔗 API endpoint: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('Database pool closed');
  });
});
