const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Mock data for development
const mockData = {
  users: [
    {
      id: 1,
      username: 'demo_user',
      password_hash: 'not_a_real_hash',
      created_at: new Date().toISOString(),
      has_diagnosis: true,
      diagnosis_type: 'anxiety',
      notifications_enabled: true,
      dark_mode: false
    }
  ],
  hrvData: [
    { id: 1, user_id: 1, value: 52.3, timestamp: new Date(Date.now() - 0*24*60*60*1000).toISOString(), source_name: 'Apple Health' },
    { id: 2, user_id: 1, value: 48.7, timestamp: new Date(Date.now() - 1*24*60*60*1000).toISOString(), source_name: 'Apple Health' },
    { id: 3, user_id: 1, value: 41.2, timestamp: new Date(Date.now() - 2*24*60*60*1000).toISOString(), source_name: 'Apple Health' },
    { id: 4, user_id: 1, value: 43.5, timestamp: new Date(Date.now() - 3*24*60*60*1000).toISOString(), source_name: 'Apple Health' },
    { id: 5, user_id: 1, value: 45.8, timestamp: new Date(Date.now() - 4*24*60*60*1000).toISOString(), source_name: 'Apple Health' },
    { id: 6, user_id: 1, value: 50.2, timestamp: new Date(Date.now() - 5*24*60*60*1000).toISOString(), source_name: 'Apple Health' },
    { id: 7, user_id: 1, value: 52.1, timestamp: new Date(Date.now() - 6*24*60*60*1000).toISOString(), source_name: 'Apple Health' }
  ],
  moodEntries: [
    { id: 1, user_id: 1, mood: 'happy', notes: 'Great day at work!', timestamp: new Date(Date.now() - 0*24*60*60*1000).toISOString() },
    { id: 2, user_id: 1, mood: 'neutral', notes: 'Feeling okay, nothing special.', timestamp: new Date(Date.now() - 1*24*60*60*1000).toISOString() },
    { id: 3, user_id: 1, mood: 'sad', notes: 'Stressed about project deadline.', timestamp: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
    { id: 4, user_id: 1, mood: 'happy', notes: 'Weekend with friends.', timestamp: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
    { id: 5, user_id: 1, mood: 'excited', notes: 'Started a new book!', timestamp: new Date(Date.now() - 4*24*60*60*1000).toISOString() }
  ],
  sleepEntries: [
    { id: 1, user_id: 1, hours: 8.0, quality: 5, notes: 'Great night\'s rest', timestamp: new Date(Date.now() - 0*24*60*60*1000).toISOString() },
    { id: 2, user_id: 1, hours: 6.5, quality: 3, notes: 'Woke up early', timestamp: new Date(Date.now() - 1*24*60*60*1000).toISOString() },
    { id: 3, user_id: 1, hours: 7.5, quality: 4, notes: 'Pretty good', timestamp: new Date(Date.now() - 2*24*60*60*1000).toISOString() },
    { id: 4, user_id: 1, hours: 7.0, quality: 3, notes: 'Average', timestamp: new Date(Date.now() - 3*24*60*60*1000).toISOString() },
    { id: 5, user_id: 1, hours: 8.0, quality: 5, notes: 'Excellent sleep', timestamp: new Date(Date.now() - 4*24*60*60*1000).toISOString() },
    { id: 6, user_id: 1, hours: 6.0, quality: 2, notes: 'Restless night', timestamp: new Date(Date.now() - 5*24*60*60*1000).toISOString() },
    { id: 7, user_id: 1, hours: 7.5, quality: 4, notes: 'Good sleep', timestamp: new Date(Date.now() - 6*24*60*60*1000).toISOString() }
  ]
};

// Server configuration
const PORT = process.env.PORT || 5000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Content types for files
const CONTENT_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Parse request body
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        if (body) {
          resolve(JSON.parse(body));
        } else {
          resolve({});
        }
      } catch (error) {
        reject(error);
      }
    });
    
    req.on('error', error => {
      reject(error);
    });
  });
};

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url);
  const pathname = parsedUrl.pathname;
  
  // Handle API requests
  if (pathname.startsWith('/api/')) {
    // Set common headers for API responses
    res.setHeader('Content-Type', 'application/json');
    
    // Handle API routes
    try {
      // Health check
      if (pathname === '/api/health' && req.method === 'GET') {
        res.statusCode = 200;
        res.end(JSON.stringify({ status: 'ok' }));
        return;
      }
      
      // Get HRV data
      if (pathname === '/api/hrv' && req.method === 'GET') {
        // Sort by timestamp in descending order to mimic database query
        const sortedData = [...mockData.hrvData].sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        res.statusCode = 200;
        res.end(JSON.stringify(sortedData));
        return;
      }
      
      // Get mood entries
      if (pathname === '/api/mood' && req.method === 'GET') {
        // Sort by timestamp in descending order to mimic database query
        const sortedData = [...mockData.moodEntries].sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        res.statusCode = 200;
        res.end(JSON.stringify(sortedData));
        return;
      }
      
      // Save mood entry
      if (pathname === '/api/mood' && req.method === 'POST') {
        const body = await parseBody(req);
        const { mood, notes, userId = 1 } = body;
        
        if (!mood) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Mood is required' }));
          return;
        }
        
        // Create new mood entry
        const newEntry = {
          id: mockData.moodEntries.length + 1,
          user_id: userId,
          mood,
          notes,
          timestamp: new Date().toISOString()
        };
        
        // Add to mock data
        mockData.moodEntries.push(newEntry);
        
        res.statusCode = 201;
        res.end(JSON.stringify(newEntry));
        return;
      }
      
      // Save HRV data
      if (pathname === '/api/hrv' && req.method === 'POST') {
        const body = await parseBody(req);
        const { value, sourceName = 'Manual', userId = 1 } = body;
        
        if (!value) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'HRV value is required' }));
          return;
        }
        
        // Create new HRV entry
        const newEntry = {
          id: mockData.hrvData.length + 1,
          user_id: userId,
          value,
          source_name: sourceName,
          timestamp: new Date().toISOString()
        };
        
        // Add to mock data
        mockData.hrvData.push(newEntry);
        
        res.statusCode = 201;
        res.end(JSON.stringify(newEntry));
        return;
      }
      
      // Get sleep entries
      if (pathname === '/api/sleep' && req.method === 'GET') {
        // Sort by timestamp in descending order to mimic database query
        const sortedData = [...mockData.sleepEntries].sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        res.statusCode = 200;
        res.end(JSON.stringify(sortedData));
        return;
      }
      
      // Save sleep entry
      if (pathname === '/api/sleep' && req.method === 'POST') {
        const body = await parseBody(req);
        const { hours, quality, notes, userId = 1 } = body;
        
        if (!hours || !quality) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Hours and quality are required' }));
          return;
        }
        
        // Create new sleep entry
        const newEntry = {
          id: mockData.sleepEntries.length + 1,
          user_id: userId,
          hours: parseFloat(hours),
          quality: parseInt(quality),
          notes,
          timestamp: new Date().toISOString()
        };
        
        // Add to mock data
        mockData.sleepEntries.push(newEntry);
        
        res.statusCode = 201;
        res.end(JSON.stringify(newEntry));
        return;
      }
      
      // Get user settings
      if (pathname.startsWith('/api/settings/') && req.method === 'GET') {
        const userId = parseInt(pathname.split('/')[3]);
        
        if (isNaN(userId)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'User ID must be a number' }));
          return;
        }
        
        // Find user
        const user = mockData.users.find(u => u.id === userId);
        
        if (!user) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'User not found' }));
          return;
        }
        
        // Return settings
        const settings = {
          has_diagnosis: user.has_diagnosis,
          diagnosis_type: user.diagnosis_type,
          notifications_enabled: user.notifications_enabled,
          dark_mode: user.dark_mode
        };
        
        res.statusCode = 200;
        res.end(JSON.stringify(settings));
        return;
      }
      
      // Update user settings
      if (pathname.startsWith('/api/settings/') && req.method === 'PUT') {
        const userId = parseInt(pathname.split('/')[3]);
        
        if (isNaN(userId)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'User ID must be a number' }));
          return;
        }
        
        const body = await parseBody(req);
        const { hasDiagnosis, diagnosisType, notificationsEnabled, darkMode } = body;
        
        // Find user index
        const userIndex = mockData.users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'User not found' }));
          return;
        }
        
        // Update user
        mockData.users[userIndex] = {
          ...mockData.users[userIndex],
          has_diagnosis: hasDiagnosis,
          diagnosis_type: diagnosisType,
          notifications_enabled: notificationsEnabled,
          dark_mode: darkMode
        };
        
        // Return updated user
        res.statusCode = 200;
        res.end(JSON.stringify(mockData.users[userIndex]));
        return;
      }
      
      // Route not found
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'API endpoint not found' }));
    } catch (error) {
      console.error('API Error:', error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Server error', details: error.message }));
    }
    return;
  }
  
  // Handle static files
  try {
    // Default to serving index.html for root path
    let filePath = pathname === '/' ? path.join(PUBLIC_DIR, 'index.html') : path.join(PUBLIC_DIR, pathname);
    
    // Check if file exists
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end('File not found');
      return;
    }
    
    // Determine content type
    const extname = path.extname(filePath);
    const contentType = CONTENT_TYPES[extname] || 'application/octet-stream';
    
    // Read and serve file
    const content = fs.readFileSync(filePath);
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.end(content);
  } catch (error) {
    console.error('Static file error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Internal server error');
  }
});

// Start server
function startServer() {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}/`);
    console.log(`Using mock data with ${mockData.users.length} users, ${mockData.hrvData.length} HRV entries, ${mockData.moodEntries.length} mood entries, and ${mockData.sleepEntries.length} sleep entries`);
  });
}

startServer();