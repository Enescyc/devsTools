import { UuidService } from '../services/uuidService';

describe('UuidService', () => {
  let uuidService: UuidService;

  beforeEach(() => {
    uuidService = new UuidService();
  });

  describe('generate', () => {
    it('should generate a valid UUID', () => {
      const uuid = uuidService.generate('v4');
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('validate', () => {
    it('should return true for valid UUID', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      expect(uuidService.validate(uuid)).toBe(true);
    });

    it('should return false for invalid UUID', () => {
      const uuid = 'invalid-uuid';
      expect(uuidService.validate(uuid)).toBe(false);
    });
  });

  describe('getInfo', () => {
    it('should return correct info for v4 UUID', () => {
      const uuid = uuidService.generate('v4');
      const info = uuidService.getInfo(uuid);
      expect(info).toEqual({
        version: 4,
        variant: 1,
        isValid: true,
        isNil: false,
        timestamp: null
      });
    });

    it('should return info object with isValid false for invalid UUID', () => {
      const uuid = 'invalid-uuid';
      const info = uuidService.getInfo(uuid);
      expect(info).toEqual({
        version: null,
        variant: null,
        isValid: false,
        isNil: false,
        timestamp: null
      });
    });
  });

  describe('generateBulk', () => {
    it('should generate specified number of UUIDs', () => {
      const count = 5;
      const uuids = uuidService.generateBulk(count, 'v4');
      expect(uuids).toHaveLength(count);
      uuids.forEach(uuid => {
        expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      });
    });

    it('should throw error for invalid count', () => {
      expect(() => uuidService.generateBulk(0, 'v4')).toThrow('Count must be greater than 0');
      expect(() => uuidService.generateBulk(-1, 'v4')).toThrow('Count must be greater than 0');
    });
  });

  describe('getTimestamp', () => {
    it('should extract timestamp from sequential UUIDs in correct order', () => {
      // Generate two sequential UUIDs
      const uuids = uuidService.generateSequential(2);
      
      // Get their timestamps
      const timestamp1 = uuidService.getTimestamp(uuids[0]);
      const timestamp2 = uuidService.getTimestamp(uuids[1]);
      
      // Verify both timestamps are valid Date objects
      expect(timestamp1).toBeInstanceOf(Date);
      expect(timestamp2).toBeInstanceOf(Date);
      
      // Verify the second timestamp is greater than or equal to the first
      expect(timestamp2!.getTime()).toBeGreaterThanOrEqual(timestamp1!.getTime());
    });

    it('should return null for non-v1 UUID', () => {
      const uuid = uuidService.generate('v4');
      expect(uuidService.getTimestamp(uuid)).toBeNull();
    });
  });

  describe('generateSequential', () => {
    it('should generate sequential UUIDs', () => {
      const uuids = uuidService.generateSequential(2);
      expect(uuids).toHaveLength(2);
      expect(uuids[0]).not.toBe(uuids[1]);
      
      // Verify UUID format
      uuids.forEach(uuid => {
        expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-1[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      });

      // Verify timestamps are sequential
      const timestamp1 = uuidService.getTimestamp(uuids[0])!.getTime();
      const timestamp2 = uuidService.getTimestamp(uuids[1])!.getTime();
      expect(timestamp2).toBeGreaterThanOrEqual(timestamp1);
    });

    it('should generate unique UUIDs', () => {
      const count = 100;
      const uuids = uuidService.generateSequential(count);
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(count);
    });
  });
}); 