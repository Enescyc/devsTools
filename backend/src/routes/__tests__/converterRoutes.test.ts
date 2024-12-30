import request from 'supertest';
import express from 'express';
import { json } from 'body-parser';
import converterRoutes from '../converterRoutes';

const app = express();
app.use(json());
app.use('/api/convert', converterRoutes);

describe('Converter Routes', () => {
  describe('POST /api/convert/json-to-csv', () => {
    it('should convert JSON to CSV successfully', async () => {
      const input = JSON.stringify([
        { name: 'John', age: 30 },
        { name: 'Jane', age: 25 }
      ]);

      const response = await request(app)
        .post('/api/convert/json-to-csv')
        .send({ input })
        .expect(200);

      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toContain('"name","age"');
      expect(response.body.result).toContain('"John",30');
      expect(response.body.result).toContain('"Jane",25');
    });

    it('should return 400 for invalid JSON', async () => {
      const response = await request(app)
        .post('/api/convert/json-to-csv')
        .send({ input: 'invalid json' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing input', async () => {
      const response = await request(app)
        .post('/api/convert/json-to-csv')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Input must be a string');
    });
  });

  describe('POST /api/convert/json-to-xml', () => {
    it('should convert JSON to XML successfully', async () => {
      const input = JSON.stringify({ name: 'John', age: 30 });

      const response = await request(app)
        .post('/api/convert/json-to-xml')
        .send({ input })
        .expect(200);

      expect(response.body).toHaveProperty('result');
      const result = response.body.result;
      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).toMatch(/<root[^>]*>/);
      expect(result).toMatch(/<name>John<\/name>/);
      expect(result).toMatch(/<age>30<\/age>/);
      expect(result).toMatch(/<\/root>/);
    });

    it('should return 400 for invalid JSON', async () => {
      const response = await request(app)
        .post('/api/convert/json-to-xml')
        .send({ input: 'invalid json' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing input', async () => {
      const response = await request(app)
        .post('/api/convert/json-to-xml')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Input must be a string');
    });
  });

  describe('POST /api/convert/json-to-yaml', () => {
    it('should convert JSON to YAML successfully', async () => {
      const input = JSON.stringify({ name: 'John', age: 30 });

      const response = await request(app)
        .post('/api/convert/json-to-yaml')
        .send({ input })
        .expect(200);

      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toContain('name: John');
      expect(response.body.result).toContain('age: 30');
    });

    it('should return 400 for invalid JSON', async () => {
      const response = await request(app)
        .post('/api/convert/json-to-yaml')
        .send({ input: 'invalid json' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing input', async () => {
      const response = await request(app)
        .post('/api/convert/json-to-yaml')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Input must be a string');
    });
  });
}); 