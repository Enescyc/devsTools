import { Request, Response } from 'express';
import { StringController } from '../../controllers/stringController';
import { StringService } from '../../services/stringService';

// Mock StringService
jest.mock('../../services/stringService');

describe('StringController', () => {
  let stringController: StringController;
  let mockStringService: jest.Mocked<StringService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockStringService = {
      escapeString: jest.fn(),
      unescapeString: jest.fn(),
      validateBase64: jest.fn()
    } as unknown as jest.Mocked<StringService>;
    
    // @ts-ignore - for testing purposes
    StringService.mockImplementation(() => mockStringService);
    
    stringController = new StringController();

    // Setup response mock
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();
    mockResponse = {
      json: jsonMock,
      status: statusMock,
    };
  });

  describe('escapeString', () => {
    it('should return escaped string when input and mode are valid', () => {
      const input = 'test string';
      const mode = 'javascript';
      mockRequest = {
        body: { input, mode }
      };

      mockStringService.escapeString.mockReturnValue('escaped test string');

      stringController.escapeString(mockRequest as Request, mockResponse as Response);

      expect(mockStringService.escapeString).toHaveBeenCalledWith(input, mode);
      expect(jsonMock).toHaveBeenCalledWith({
        result: 'escaped test string'
      });
    });

    it('should return 400 when input or mode is missing', () => {
      mockRequest = {
        body: {
          input: 'test string'
          // mode is missing
        }
      };

      stringController.escapeString(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Input string and mode are required'
      });
    });

    it('should return 400 when service throws an error', () => {
      mockRequest = {
        body: {
          input: 'test string',
          mode: 'javascript'
        }
      };

      mockStringService.escapeString.mockImplementation(() => {
        throw new Error('Service error');
      });

      stringController.escapeString(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Service error'
      });
    });
  });

  describe('unescapeString', () => {
    it('should return unescaped string when input and mode are valid', () => {
      const input = 'escaped test string';
      const mode = 'javascript';
      mockRequest = {
        body: { input, mode }
      };

      mockStringService.unescapeString.mockReturnValue('test string');

      stringController.unescapeString(mockRequest as Request, mockResponse as Response);

      expect(mockStringService.unescapeString).toHaveBeenCalledWith(input, mode);
      expect(jsonMock).toHaveBeenCalledWith({
        result: 'test string'
      });
    });

    it('should return 400 when input or mode is missing', () => {
      mockRequest = {
        body: {
          input: 'test string'
          // mode is missing
        }
      };

      stringController.unescapeString(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Input string and mode are required'
      });
    });
  });

  describe('validateBase64', () => {
    it('should return validation result when input is valid', () => {
      const input = 'validBase64String';
      mockRequest = {
        body: { input }
      };

      mockStringService.validateBase64.mockReturnValue(true);

      stringController.validateBase64(mockRequest as Request, mockResponse as Response);

      expect(mockStringService.validateBase64).toHaveBeenCalledWith(input);
      expect(jsonMock).toHaveBeenCalledWith({
        isValid: true
      });
    });

    it('should return 400 when input is missing', () => {
      mockRequest = {
        body: {}
      };

      stringController.validateBase64(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Input string is required'
      });
    });
  });
}); 