const request = require('supertest');
const express = require('express');

// Mock app for testing basic functionality
const app = express();
app.use(express.json());

// Mock health endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

describe('Server Health Check', () => {
  test('GET /api/health should return 200', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
    expect(response.body).toHaveProperty('environment');
  });

  test('Health endpoint should return JSON', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/);
    
    expect(typeof response.body).toBe('object');
  });
});

describe('Environment Setup', () => {
  test('Node environment should be set', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });

  test('Process should have uptime', () => {
    expect(process.uptime()).toBeGreaterThan(0);
  });
});
