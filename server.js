const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const OpenAI = require('openai');

// Initialize OpenAI client
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

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
    { id: 1, user_id: 1, mood: 'happy', notes: 'Great day at work!', timestamp: new Date(Date.now() - 0*24*60*60*1000).toISOString(), mood_score: 8 },
    { id: 2, user_id: 1, mood: 'neutral', notes: 'Feeling okay, nothing special.', timestamp: new Date(Date.now() - 1*24*60*60*1000).toISOString(), mood_score: 5 },
    { id: 3, user_id: 1, mood: 'sad', notes: 'Stressed about project deadline.', timestamp: new Date(Date.now() - 2*24*60*60*1000).toISOString(), mood_score: 3 },
    { id: 4, user_id: 1, mood: 'happy', notes: 'Weekend with friends.', timestamp: new Date(Date.now() - 3*24*60*60*1000).toISOString(), mood_score: 7 },
    { id: 5, user_id: 1, mood: 'excited', notes: 'Started a new book!', timestamp: new Date(Date.now() - 4*24*60*60*1000).toISOString(), mood_score: 9 }
  ],
  sleepData: [
    { id: 1, user_id: 1, duration_hours: 8.5, quality: 4, bedtime: '22:30', waketime: '07:00', notes: 'Slept well', date: new Date(Date.now() - 0*24*60*60*1000).toISOString().split('T')[0] },
    { id: 2, user_id: 1, duration_hours: 8.0, quality: 3, bedtime: '23:15', waketime: '07:15', notes: 'Took a while to fall asleep', date: new Date(Date.now() - 1*24*60*60*1000).toISOString().split('T')[0] },
    { id: 3, user_id: 1, duration_hours: 8.0, quality: 5, bedtime: '22:45', waketime: '06:45', notes: 'Perfect sleep!', date: new Date(Date.now() - 2*24*60*60*1000).toISOString().split('T')[0] },
    { id: 4, user_id: 1, duration_hours: 8.5, quality: 3, bedtime: '23:00', waketime: '07:30', notes: 'Woke up a few times', date: new Date(Date.now() - 3*24*60*60*1000).toISOString().split('T')[0] },
    { id: 5, user_id: 1, duration_hours: 8.5, quality: 4, bedtime: '22:20', waketime: '06:50', notes: 'Good rest', date: new Date(Date.now() - 4*24*60*60*1000).toISOString().split('T')[0] }
  ]
};

// Server configuration
const PORT = process.env.PORT || 3001;
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
        
        // Convert mood string to score for consistency
        const moodScores = {
          'sad': 2,
          'meh': 3,
          'neutral': 5,
          'happy': 7,
          'excited': 9
        };
        
        // Create new mood entry
        const newEntry = {
          id: mockData.moodEntries.length + 1,
          user_id: userId,
          mood,
          mood_score: moodScores[mood] || 5,
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
      
      // Get sleep data
      if (pathname === '/api/sleep' && req.method === 'GET') {
        // Sort by date in descending order
        const sortedData = [...mockData.sleepData].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        
        res.statusCode = 200;
        res.end(JSON.stringify(sortedData));
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
      
      // AI Stress Assessment
      if (pathname === '/api/stress/assess' && req.method === 'POST') {
        try {
          const body = await parseBody(req);
          const { userId = 1 } = body;
          
          // Collect last 5 days of data
          const now = new Date();
          const fiveDaysAgo = new Date(now.getTime() - 5*24*60*60*1000);
          
          // Get recent data
          const recentHrvData = mockData.hrvData.filter(entry => 
            new Date(entry.timestamp) >= fiveDaysAgo
          ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          
          const recentMoodData = mockData.moodEntries.filter(entry => 
            new Date(entry.timestamp) >= fiveDaysAgo
          ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          
          const recentSleepData = mockData.sleepData.filter(entry => 
            new Date(entry.date) >= fiveDaysAgo
          ).sort((a, b) => new Date(b.date) - new Date(a.date));
          
          // Calculate baselines (using longer history for context)
          const allHrvValues = mockData.hrvData.map(d => d.value);
          const hrvBaseline = allHrvValues.length > 0 ? 
            allHrvValues.reduce((sum, val) => sum + val, 0) / allHrvValues.length : 50;
          
          // Prepare data payload for AI
          const assessmentData = {
            window_days: 5,
            timezone: 'America/New_York',
            days: [],
            features: {
              mood_avg: 0,
              sleep_duration_avg: 0,
              sleep_quality_avg: 0,
              hrv_delta_avg_ms: 0,
              trend: { mood_slope: 0, hrv_slope: 0 }
            },
            data_completeness: {
              days_with_hrv: new Set(recentHrvData.map(d => d.timestamp.split('T')[0])).size,
              days_with_sleep: new Set(recentSleepData.map(d => d.date)).size,
              days_with_mood: new Set(recentMoodData.map(d => d.timestamp.split('T')[0])).size
            }
          };
          
          // Build daily data
          for (let i = 0; i < 5; i++) {
            const dayDate = new Date(now.getTime() - i*24*60*60*1000);
            const dateStr = dayDate.toISOString().split('T')[0];
            
            const dayHrv = recentHrvData.find(d => d.timestamp.startsWith(dateStr));
            const dayMood = recentMoodData.find(d => d.timestamp.startsWith(dateStr));
            const daySleep = recentSleepData.find(d => d.date === dateStr);
            
            assessmentData.days.push({
              date: dateStr,
              mood_score: dayMood?.mood_score || null,
              mood_notes: dayMood?.notes || null,
              sleep: daySleep ? {
                duration_hours: daySleep.duration_hours,
                quality: daySleep.quality,
                bedtime: daySleep.bedtime,
                waketime: daySleep.waketime
              } : null,
              hrv: dayHrv ? {
                rmssd_ms: dayHrv.value,
                baseline_ms: hrvBaseline
              } : null
            });
          }
          
          // Calculate features
          const validMoods = assessmentData.days.filter(d => d.mood_score).map(d => d.mood_score);
          const validSleep = assessmentData.days.filter(d => d.sleep).map(d => d.sleep);
          const validHrvs = assessmentData.days.filter(d => d.hrv).map(d => d.hrv.rmssd_ms - d.hrv.baseline_ms);
          
          assessmentData.features.mood_avg = validMoods.length > 0 ? 
            validMoods.reduce((sum, val) => sum + val, 0) / validMoods.length : 0;
          assessmentData.features.sleep_duration_avg = validSleep.length > 0 ? 
            validSleep.reduce((sum, val) => sum + val.duration_hours, 0) / validSleep.length : 0;
          assessmentData.features.sleep_quality_avg = validSleep.length > 0 ? 
            validSleep.reduce((sum, val) => sum + val.quality, 0) / validSleep.length : 0;
          assessmentData.features.hrv_delta_avg_ms = validHrvs.length > 0 ? 
            validHrvs.reduce((sum, val) => sum + val, 0) / validHrvs.length : 0;
          
          // Call OpenAI for assessment
          const systemPrompt = "You are a wellness assessor. Analyze the provided wellness data and return a JSON stress assessment. Be conservative if data is limited.";
          const userPrompt = `Analyze this wellness data and return JSON only matching this exact schema:

Data: ${JSON.stringify(assessmentData)}

Return ONLY this JSON format:
{
  "level": "low" or "moderate" or "high",
  "score": number 0-100,
  "rationale": "Brief 1-2 sentence analysis",
  "contributing_factors": ["factor1", "factor2"],
  "recommendations": ["tip1", "tip2"],
  "trend": "improving" or "worsening" or "stable",
  "data_warnings": []
}`;
          
          console.log('Calling OpenAI for stress assessment...');
          
          // Store assessment data reference for fallback
          const dataForFallback = {
            avgMood: assessmentData.features.mood_avg,
            dataCompleteness: assessmentData.data_completeness
          };
          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Use a more reliable model
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            response_format: { type: "json_object" },
            max_tokens: 500
          });
          
          console.log('OpenAI response received, content length:', response.choices[0]?.message?.content?.length || 0);
          
          if (!response.choices?.[0]?.message?.content) {
            throw new Error('Invalid OpenAI response structure');
          }
          
          const assessment = JSON.parse(response.choices[0].message.content);
          
          // Validate and sanitize response
          const sanitizedAssessment = {
            level: ['low', 'moderate', 'high'].includes(assessment.level) ? assessment.level : 'moderate',
            score: Math.min(100, Math.max(0, parseInt(assessment.score) || 50)),
            rationale: (assessment.rationale || 'Assessment based on available data.').substring(0, 200),
            contributing_factors: Array.isArray(assessment.contributing_factors) ? 
              assessment.contributing_factors.slice(0, 3).map(f => f.substring(0, 60)) : [],
            recommendations: Array.isArray(assessment.recommendations) ? 
              assessment.recommendations.slice(0, 3).map(r => r.substring(0, 80)) : [],
            trend: ['improving', 'worsening', 'stable'].includes(assessment.trend) ? assessment.trend : 'stable',
            data_warnings: Array.isArray(assessment.data_warnings) ? assessment.data_warnings : []
          };
          
          console.log('Stress assessment completed:', sanitizedAssessment.level, 'level');
          
          res.statusCode = 200;
          res.end(JSON.stringify(sanitizedAssessment));
          return;
          
        } catch (error) {
          console.error('Stress assessment error:', error);
          
          // Provide a fallback assessment if OpenAI fails
          const fallbackScore = dataForFallback.avgMood > 0 ? 
            Math.min(100, Math.max(0, Math.round(dataForFallback.avgMood * 15 + 25))) : 50;
          
          const fallbackAssessment = {
            level: dataForFallback.avgMood < 4 ? 'moderate' : 'low',
            score: fallbackScore,
            rationale: 'Assessment based on available mood and wellness data. AI analysis temporarily unavailable.',
            contributing_factors: ['Limited data analysis capability'],
            recommendations: ['Continue tracking your wellness data', 'Try the assessment again later'],
            trend: 'stable',
            data_warnings: ['AI analysis unavailable - using basic assessment']
          };
          
          console.log('Using fallback assessment:', fallbackAssessment.level);
          
          res.statusCode = 200;
          res.end(JSON.stringify(fallbackAssessment));
          return;
        }
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
    console.log(`Using mock data with ${mockData.users.length} users, ${mockData.hrvData.length} HRV entries, and ${mockData.moodEntries.length} mood entries`);
  });
}

startServer();