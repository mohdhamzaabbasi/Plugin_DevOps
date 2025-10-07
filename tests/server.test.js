const request = require('supertest');
const app = require('../server'); 
const crypto = require('crypto');
const {realPayload}=require('../data'); 

// Mock the Elastic client
jest.mock('../elasticClient', () => ({
  index: jest.fn(() => Promise.resolve())
}));

SECRET_KEY = process.env.SECRET_KEY;
IV = process.env.IV;
process.env.PORT = 3000;

// Helper for valid encrypted timestamp
function getValidEncryptedTimestamp() {
  const now = Date.now();
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(process.env.SECRET_KEY),
    Buffer.from(process.env.IV)
  );
  let encrypted = cipher.update(String(now), 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

describe('POST /', () => {
  it('should reject unauthorized requests (missing timestamp header)', async () => {
    const payload = JSON.stringify(realPayload);
    const res = await request(app)
      .post('/')
      .send(payload)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(401);
  });

  it('should reject requests with checksum error', async () => {
    const encTimestamp = getValidEncryptedTimestamp();
    const payload = JSON.stringify(realPayload);
    const res = await request(app)
      .post('/')
      .send(payload)
      .set('X-Encrypted-Timestamp', encTimestamp)
      .set('X-Checksum', 'WRONG_CHECKSUM')
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(400);
  });

  it('should accept valid data and respond with 200', async () => {
    const encTimestamp = getValidEncryptedTimestamp();
    const payload = JSON.stringify(realPayload);
    const checksum = crypto.createHash('sha256').update(payload).digest('hex');
    const res = await request(app)
      .post('/')
      .send(payload)
      .set('X-Encrypted-Timestamp', encTimestamp)
      .set('X-Checksum', checksum)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
  });

  it('should reject payloads missing required fields (validation failure)', async () => {
    const badPayload = JSON.parse(JSON.stringify(realPayload));
    delete badPayload.build_data.displayName;
    const encTimestamp = getValidEncryptedTimestamp();
    const payload = JSON.stringify(badPayload);
    const checksum = crypto.createHash('sha256').update(payload).digest('hex');
    const res = await request(app)
      .post('/')
      .send(payload)
      .set('X-Encrypted-Timestamp', encTimestamp)
      .set('X-Checksum', checksum)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(400);
  });

  it('should reject with 401 if timestamp header is invalid', async () => {
    const payload = JSON.stringify(realPayload);
    const res = await request(app)
      .post('/')
      .send(payload)
      .set('X-Encrypted-Timestamp', 'invalid')
      .set('X-Checksum', 'SOMECHECKSUM')
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(401);
  });
});
