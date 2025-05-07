const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Serve static files
app.use(express.static('public'));
app.use(express.json());

// Mock data for API responses
const mockHRVData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - i);
  
  // Baseline HRV with some random variation
  let value = 50 + Math.random() * 20;
  
  // Add a simulated trend
  if (i < 5) {
    value = value - (4 - i) * 5;
  }
  
  // Add some noise
  value = value + (Math.random() * 10 - 5);
  
  // Ensure reasonable values (ms)
  value = Math.max(20, Math.min(100, value));
  
  return {
    date: date.toISOString().split('T')[0],
    value: Math.round(value * 10) / 10, // Round to 1 decimal place
    sourceName: 'Apple Health',
  };
});

// Mock mood data
const moodData = [
  { date: '2025-05-07', mood: 'happy', notes: 'Great day at work!' },
  { date: '2025-05-06', mood: 'neutral', notes: 'Feeling okay, nothing special.' },
  { date: '2025-05-05', mood: 'sad', notes: 'Stressed about project deadline.' },
  { date: '2025-05-04', mood: 'happy', notes: 'Weekend with friends.' },
  { date: '2025-05-03', mood: 'excited', notes: 'Started a new book!' }
];

// User preferences and settings
let userSettings = {
  hasDiagnosis: true,
  diagnosisType: 'anxiety',
  consentGiven: true,
  privacyConsentGiven: true,
  notificationsEnabled: true,
  darkMode: false
};

// API endpoint for HRV data
app.get('/api/hrv', (req, res) => {
  const days = parseInt(req.query.days) || 30;
  res.json(mockHRVData.slice(0, days));
});

// API endpoint for latest HRV
app.get('/api/hrv/latest', (req, res) => {
  res.json(mockHRVData[0]);
});

// API endpoint for mood data
app.get('/api/mood', (req, res) => {
  res.json(moodData);
});

// API endpoint for saving mood entry
app.post('/api/mood', (req, res) => {
  const { date, mood, notes } = req.body;
  
  // Remove any existing entry for this date
  const existingIndex = moodData.findIndex(entry => entry.date === date);
  if (existingIndex !== -1) {
    moodData.splice(existingIndex, 1);
  }
  
  // Add new entry
  moodData.unshift({ date, mood, notes });
  
  res.json({ success: true });
});

// API endpoint for user settings
app.get('/api/settings', (req, res) => {
  res.json(userSettings);
});

// API endpoint for updating user settings
app.post('/api/settings', (req, res) => {
  userSettings = { ...userSettings, ...req.body };
  res.json({ success: true });
});

// API endpoint for stress detection
app.get('/api/stress', (req, res) => {
  const latestHRV = mockHRVData[0].value;
  
  let stressLevel;
  if (latestHRV < 30) {
    stressLevel = 'high';
  } else if (latestHRV < 50) {
    stressLevel = 'moderate';
  } else {
    stressLevel = 'low';
  }
  
  res.json({
    stressLevel,
    hrvValue: latestHRV,
    recommendation: getRecommendation(stressLevel, userSettings.diagnosisType)
  });
});

function getRecommendation(stressLevel, diagnosisType) {
  if (stressLevel === 'high') {
    if (diagnosisType === 'anxiety') {
      return 'Your HRV indicates high stress. Try a 5-minute breathing exercise.';
    } else if (diagnosisType === 'depression') {
      return 'Your HRV indicates high stress. Consider reaching out to a friend or going for a short walk.';
    } else if (diagnosisType === 'bipolar') {
      return 'Your HRV indicates high stress. Try a grounding exercise and check in with your support system.';
    } else {
      return 'Your HRV indicates high stress. Take a moment for self-care.';
    }
  } else if (stressLevel === 'moderate') {
    return 'Your stress level is moderate. Consider taking a short break.';
  } else {
    return 'Your stress level is low. Keep up the good work!';
  }
}

// Serve demo page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`HRV & Mood Tracker demo server running at http://localhost:${PORT}`);
});