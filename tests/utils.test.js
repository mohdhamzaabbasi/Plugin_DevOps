const crypto = require('crypto');
const utils = require('../utils');
const {validData, extractedData, test_data}=require('../data'); 

describe('Utils Module', () => {
  
  describe('verifyAuthorization', () => {
    it('should succeed with a valid encrypted timestamp', () => {
      const now = Date.now();
      const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.SECRET_KEY), Buffer.from(process.env.IV));
      let encrypted = cipher.update(String(now), 'utf8', 'base64');
      encrypted += cipher.final('base64');
      const req = { header: (key) => key === "X-Encrypted-Timestamp" ? encrypted : undefined };
      const result = utils.verifyAuthorization(req);
      expect(result.success).toBe(true);
    });

    it('should fail if no header present', () => {
      const req = { header: () => undefined };
      const result = utils.verifyAuthorization(req);
      expect(result.success).toBe(false);
    });

    it('should fail on invalid header', () => {
      const req = { header: (key) => key === "X-Encrypted-Timestamp" ? "invalid" : undefined };
      const result = utils.verifyAuthorization(req);
      expect(result.success).toBe(false);
    });
  });

  describe('verifyChecksum', () => {
    it('should verify correct checksum', () => {
      const data = JSON.stringify(validData);
      const req = {
        header: (key) => key === "X-Checksum" ? utils.sha256(data) : undefined,
        body: Buffer.from(data, 'utf8')
      };
      const result = utils.verifyChecksum(req);
      expect(result.success).toBe(true);
    });

    it('should fail with wrong checksum', () => {
      const data = JSON.stringify(validData);
      const req = {
        header: (key) => key === "X-Checksum" ? "wrong" : undefined,
        body: Buffer.from(data, 'utf8')
      };
      const result = utils.verifyChecksum(req);
      expect(result.success).toBe(false);
    });
  });

  describe('validateData', () => {
    it('should validate correct data', () => {
      const result = utils.validateData(validData);
      expect(result.valid).toBe(true);
    });

    it('should return errors for invalid data', () => {
      const invalidData = {};
      const result = utils.validateData(invalidData);
      expect(result.valid).toBe(false);
      expect(Array.isArray(result.errors)).toBe(true);
    });
  });

  describe('extractRequiredData', () => {
    it('should return flattened array of steps', () => {
      const steps = utils.extractRequiredData(extractedData);
      expect(Array.isArray(steps)).toBe(true);
      expect(steps.length).toBe(1);
      expect(steps[0]).toHaveProperty("stage");
      expect(steps[0]).toHaveProperty("step");
    });
  });

  describe('extractTestReportFields', () => {
    it('should correctly extract and summarize test report data (positive case)', () => {
      
      const build_data = { fullDisplayName: 'Job #123' };

      const result = utils.extractTestReportFields({ test_data, build_data });

      expect(result.fullDisplayName).toBe('Job #123');
      expect(result.failCount).toBe(1);
      expect(result.passCount).toBe(2);
      expect(result.skipCount).toBe(0);
      expect(result.totalTestCases).toBe(2);
      expect(result.failedTestCases.length).toBe(1);
      expect(result.failedTestCases[0]).toMatchObject({
        suiteName: 'Suite A',
        testName: 'Test 2',
        errorDetails: 'Error A',
        errorStackTrace: 'Stack A',
        status: 'FAILED'
      });
    });

    it('should handle empty or missing test data gracefully (negative case)', () => {
      const test_data = {};  // Missing all expected fields
      const build_data = { fullDisplayName: 'Job #456' };

      const result = utils.extractTestReportFields({ test_data, build_data });

      expect(result.fullDisplayName).toBe('Job #456');
      expect(result.failCount).toBe(0);
      expect(result.passCount).toBe(0);
      expect(result.skipCount).toBe(0);
      expect(result.totalTestCases).toBe(0);
      expect(result.failedTestCases.length).toBe(0);
    });
  });
});