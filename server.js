const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const bodyParser = require('body-parser');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API route to get HRV data
app.get('/api/hrv', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM hrv_data 
      ORDER BY timestamp DESC 
      LIMIT 7
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// API route to get mood entries
app.get('/api/mood', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM mood_entries 
      ORDER BY timestamp DESC 
      LIMIT 7
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// API route to save a mood entry
app.post('/api/mood', async (req, res) => {
  try {
    const { mood, notes, userId = 1 } = req.body;
    
    const result = await pool.query(`
      INSERT INTO mood_entries (user_id, mood, notes) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `, [userId, mood, notes]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// API route to save HRV data
app.post('/api/hrv', async (req, res) => {
  try {
    const { value, sourceName = 'Manual', userId = 1 } = req.body;
    
    const result = await pool.query(`
      INSERT INTO hrv_data (user_id, value, source_name) 
      VALUES ($1, $2, $3) 
      RETURNING *
    `, [userId, value, sourceName]);
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// API route to get user settings
app.get('/api/settings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const result = await pool.query(`
      SELECT has_diagnosis, diagnosis_type, notifications_enabled, dark_mode 
      FROM users 
      WHERE id = $1
    `, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// API route to update user settings
app.put('/api/settings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { hasDiagnosis, diagnosisType, notificationsEnabled, darkMode } = req.body;
    
    const result = await pool.query(`
      UPDATE users 
      SET has_diagnosis = $1, 
          diagnosis_type = $2, 
          notifications_enabled = $3, 
          dark_mode = $4 
      WHERE id = $5 
      RETURNING *
    `, [hasDiagnosis, diagnosisType, notificationsEnabled, darkMode, userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Initialize database tables
async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        has_diagnosis BOOLEAN DEFAULT FALSE,
        diagnosis_type VARCHAR(50),
        notifications_enabled BOOLEAN DEFAULT TRUE,
        dark_mode BOOLEAN DEFAULT FALSE
      )
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hrv_data (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        value REAL NOT NULL,
        timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
        source_name VARCHAR(100) DEFAULT 'Manual',
        metadata JSONB
      )
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS mood_entries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        mood VARCHAR(20) NOT NULL,
        notes TEXT,
        timestamp TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    // Check if default user exists
    const userResult = await pool.query('SELECT * FROM users WHERE id = 1');
    
    if (userResult.rows.length === 0) {
      // Create default user if none exists
      await pool.query(`
        INSERT INTO users (username, password_hash, has_diagnosis, diagnosis_type)
        VALUES ('demo_user', 'not_a_real_hash', TRUE, 'anxiety')
      `);
      
      // Add some initial HRV data
      await pool.query(`
        INSERT INTO hrv_data (user_id, value, source_name, timestamp)
        VALUES 
          (1, 52.3, 'Apple Health', NOW() - INTERVAL '0 days'),
          (1, 48.7, 'Apple Health', NOW() - INTERVAL '1 days'),
          (1, 41.2, 'Apple Health', NOW() - INTERVAL '2 days'),
          (1, 43.5, 'Apple Health', NOW() - INTERVAL '3 days'),
          (1, 45.8, 'Apple Health', NOW() - INTERVAL '4 days'),
          (1, 50.2, 'Apple Health', NOW() - INTERVAL '5 days'),
          (1, 52.1, 'Apple Health', NOW() - INTERVAL '6 days')
      `);
      
      // Add some initial mood entries
      await pool.query(`
        INSERT INTO mood_entries (user_id, mood, notes, timestamp)
        VALUES 
          (1, 'happy', 'Great day at work!', NOW() - INTERVAL '0 days'),
          (1, 'neutral', 'Feeling okay, nothing special.', NOW() - INTERVAL '1 days'),
          (1, 'sad', 'Stressed about project deadline.', NOW() - INTERVAL '2 days'),
          (1, 'happy', 'Weekend with friends.', NOW() - INTERVAL '3 days'),
          (1, 'excited', 'Started a new book!', NOW() - INTERVAL '4 days')
      `);
    }
    
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

// Initialize database and start the server
initializeDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
});