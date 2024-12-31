import { Request, Response } from 'express';
import { UuidController } from '../../controllers/uuidController';
import { IUuidService, UuidVersion, UuidInfo } from '../../services/uuidService';
import { AppError } from '../../middleware/errorHandler';

describe('UuidController', () => {
  let uuidController: UuidController;
  let mockUuidService: jest.Mocked<IUuidService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockUuidService = {
      generate: jest.fn(),
      validate: jest.fn(),
      getInfo: jest.fn(),
      generateBulk: jest.fn(),
      getTimestamp: jest.fn(),
      generateSequential: jest.fn()
    };
    
    uuidController = new UuidController(mockUuidService);

    // Setup response mock
    jsonMock = jest.fn();
    mockResponse = {
      json: jsonMock
    };
  });

  describe('generate', () => {
    it('should generate v4 UUID', async () => {
      mockRequest = {
        body: { version: 'v4' }
      };

      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      mockUuidService.generate.mockReturnValue(uuid);

      await uuidController.generate(mockRequest as Request, mockResponse as Response);

      expect(mockUuidService.generate).toHaveBeenCalledWith('v4', undefined, undefined);
      expect(jsonMock).toHaveBeenCalledWith({ result: uuid });
    });

    it('should generate v5 UUID with namespace and name', async () => {
      const namespace = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
      const name = 'test';
      mockRequest = {
        body: { version: 'v5', namespace, name }
      };

      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      mockUuidService.generate.mockReturnValue(uuid);

      await uuidController.generate(mockRequest as Request, mockResponse as Response);

      expect(mockUuidService.generate).toHaveBeenCalledWith('v5', namespace, name);
      expect(jsonMock).toHaveBeenCalledWith({ result: uuid });
    });

    it('should throw error when version is missing', async () => {
      mockRequest = {
        body: {}
      };

      await expect(uuidController.generate(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Invalid UUID version'));
    });

    it('should throw error when version is invalid', async () => {
      mockRequest = {
        body: { version: 'v3' }
      };

      await expect(uuidController.generate(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Invalid UUID version'));
    });

    it('should throw error when name is missing for v5', async () => {
      mockRequest = {
        body: { version: 'v5' }
      };

      await expect(uuidController.generate(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Name is required for UUID v5'));
    });
  });

  describe('validate', () => {
    it('should validate UUID', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      mockRequest = {
        body: { uuid }
      };

      mockUuidService.validate.mockReturnValue(true);

      await uuidController.validate(mockRequest as Request, mockResponse as Response);

      expect(mockUuidService.validate).toHaveBeenCalledWith(uuid);
      expect(jsonMock).toHaveBeenCalledWith({ isValid: true });
    });

    it('should throw error when UUID is missing', async () => {
      mockRequest = {
        body: {}
      };

      await expect(uuidController.validate(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'UUID input is required'));
    });

    it('should throw error when UUID is not a string', async () => {
      mockRequest = {
        body: { uuid: 123 }
      };

      await expect(uuidController.validate(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'UUID input is required'));
    });
  });

  describe('getInfo', () => {
    it('should get UUID information', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      mockRequest = {
        body: { uuid }
      };

      const info: UuidInfo = {
        version: 4,
        variant: 1,
        isValid: true,
        isNil: false,
        timestamp: null
      };
      mockUuidService.getInfo.mockReturnValue(info);

      await uuidController.getInfo(mockRequest as Request, mockResponse as Response);

      expect(mockUuidService.getInfo).toHaveBeenCalledWith(uuid);
      expect(jsonMock).toHaveBeenCalledWith(info);
    });

    it('should throw error when UUID is missing', async () => {
      mockRequest = {
        body: {}
      };

      await expect(uuidController.getInfo(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'UUID input is required'));
    });
  });

  describe('generateBulk', () => {
    it('should generate bulk UUIDs', async () => {
      mockRequest = {
        body: { count: 3, version: 'v4' }
      };

      const uuids = [
        '123e4567-e89b-12d3-a456-426614174000',
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174002'
      ];
      mockUuidService.generateBulk.mockReturnValue(uuids);

      await uuidController.generateBulk(mockRequest as Request, mockResponse as Response);

      expect(mockUuidService.generateBulk).toHaveBeenCalledWith(3, 'v4', undefined, undefined);
      expect(jsonMock).toHaveBeenCalledWith({ results: uuids });
    });

    it('should throw error when count is missing', async () => {
      mockRequest = {
        body: { version: 'v4' }
      };

      await expect(uuidController.generateBulk(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Valid count is required (minimum 1)'));
    });

    it('should throw error when count is less than 1', async () => {
      mockRequest = {
        body: { count: 0, version: 'v4' }
      };

      await expect(uuidController.generateBulk(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Valid count is required (minimum 1)'));
    });
  });

  describe('getTimestamp', () => {
    it('should get timestamp from UUID', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      mockRequest = {
        body: { uuid }
      };

      const timestamp = new Date();
      mockUuidService.getTimestamp.mockReturnValue(timestamp);

      await uuidController.getTimestamp(mockRequest as Request, mockResponse as Response);

      expect(mockUuidService.getTimestamp).toHaveBeenCalledWith(uuid);
      expect(jsonMock).toHaveBeenCalledWith({ timestamp });
    });

    it('should throw error when UUID is not version 1', async () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      mockRequest = {
        body: { uuid }
      };

      mockUuidService.getTimestamp.mockReturnValue(null);

      await expect(uuidController.getTimestamp(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Could not extract timestamp (UUID might not be version 1)'));
    });
  });

  describe('generateSequential', () => {
    it('should generate sequential UUIDs', async () => {
      const count = 3;
      const startTime = new Date('2023-01-01T00:00:00Z');
      mockRequest = {
        body: { count, startTime: startTime.toISOString() }
      };

      const uuids = [
        '123e4567-e89b-12d3-a456-426614174000',
        '123e4567-e89b-12d3-a456-426614174001',
        '123e4567-e89b-12d3-a456-426614174002'
      ];
      mockUuidService.generateSequential.mockReturnValue(uuids);

      await uuidController.generateSequential(mockRequest as Request, mockResponse as Response);

      expect(mockUuidService.generateSequential).toHaveBeenCalledWith(count, startTime);
      expect(jsonMock).toHaveBeenCalledWith({ results: uuids });
    });

    it('should throw error when count is missing', async () => {
      mockRequest = {
        body: {}
      };

      await expect(uuidController.generateSequential(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Valid count is required (minimum 1)'));
    });

    it('should throw error when start time is invalid', async () => {
      mockRequest = {
        body: { count: 3, startTime: 'invalid-date' }
      };

      await expect(uuidController.generateSequential(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Invalid start time'));
    });
  });
}); 