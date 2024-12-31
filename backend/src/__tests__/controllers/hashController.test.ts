import { Request, Response } from 'express';
import { HashController } from '../../controllers/hashController';
import { IHashService, HashAlgorithm } from '../../services/hashService';
import { AppError } from '../../middleware/errorHandler';

describe('HashController', () => {
  let hashController: HashController;
  let mockHashService: jest.Mocked<IHashService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockHashService = {
      generateHash: jest.fn()
    };
    
    hashController = new HashController(mockHashService);

    // Setup response mock
    jsonMock = jest.fn();
    mockResponse = {
      json: jsonMock
    };
  });

  describe('generateHash', () => {
    it('should generate MD5 hash when algorithm is md5', async () => {
      const text = 'test text';
      mockRequest = {
        body: { text, algorithm: 'md5' }
      };

      mockHashService.generateHash.mockReturnValue('098f6bcd4621d373cade4e832627b4f6');

      await hashController.generateHash(mockRequest as Request, mockResponse as Response);

      expect(mockHashService.generateHash).toHaveBeenCalledWith(text, 'md5');
      expect(jsonMock).toHaveBeenCalledWith({
        result: '098f6bcd4621d373cade4e832627b4f6'
      });
    });

    it('should generate SHA1 hash when algorithm is sha1', async () => {
      const text = 'test text';
      mockRequest = {
        body: { text, algorithm: 'sha1' }
      };

      mockHashService.generateHash.mockReturnValue('0a4d55a8d778e5022fab701977c5d840bbc486d0');

      await hashController.generateHash(mockRequest as Request, mockResponse as Response);

      expect(mockHashService.generateHash).toHaveBeenCalledWith(text, 'sha1');
      expect(jsonMock).toHaveBeenCalledWith({
        result: '0a4d55a8d778e5022fab701977c5d840bbc486d0'
      });
    });

    it('should generate SHA256 hash when algorithm is sha256', async () => {
      const text = 'test text';
      mockRequest = {
        body: { text, algorithm: 'sha256' }
      };

      mockHashService.generateHash.mockReturnValue('0a4d55a8d778e5022fab701977c5d840bbc486d0123456789');

      await hashController.generateHash(mockRequest as Request, mockResponse as Response);

      expect(mockHashService.generateHash).toHaveBeenCalledWith(text, 'sha256');
      expect(jsonMock).toHaveBeenCalledWith({
        result: '0a4d55a8d778e5022fab701977c5d840bbc486d0123456789'
      });
    });

    it('should generate SHA512 hash when algorithm is sha512', async () => {
      const text = 'test text';
      mockRequest = {
        body: { text, algorithm: 'sha512' }
      };

      mockHashService.generateHash.mockReturnValue('0a4d55a8d778e5022fab701977c5d840bbc486d0123456789abcdef');

      await hashController.generateHash(mockRequest as Request, mockResponse as Response);

      expect(mockHashService.generateHash).toHaveBeenCalledWith(text, 'sha512');
      expect(jsonMock).toHaveBeenCalledWith({
        result: '0a4d55a8d778e5022fab701977c5d840bbc486d0123456789abcdef'
      });
    });

    it('should throw error when text is missing', async () => {
      mockRequest = {
        body: { algorithm: 'md5' }
      };

      await expect(hashController.generateHash(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Text input is required'));
    });

    it('should throw error when text is not a string', async () => {
      mockRequest = {
        body: { text: 123, algorithm: 'md5' }
      };

      await expect(hashController.generateHash(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Text input is required'));
    });

    it('should throw error when algorithm is missing', async () => {
      mockRequest = {
        body: { text: 'test text' }
      };

      await expect(hashController.generateHash(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Invalid hash algorithm'));
    });

    it('should throw error when algorithm is invalid', async () => {
      mockRequest = {
        body: { text: 'test text', algorithm: 'invalid' }
      };

      await expect(hashController.generateHash(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Invalid hash algorithm'));
    });

    it('should handle hash service errors', async () => {
      const text = 'test text';
      mockRequest = {
        body: { text, algorithm: 'md5' }
      };

      mockHashService.generateHash.mockImplementation(() => {
        throw new Error('Hash service error');
      });

      await expect(hashController.generateHash(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Failed to generate hash'));
    });
  });
}); 