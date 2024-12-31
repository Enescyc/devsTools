import { Request, Response } from 'express';
import { JsonController } from '../../controllers/jsonController';
import { JsonService } from '../../services/jsonService';

// Mock JsonService
jest.mock('../../services/jsonService');

describe('JsonController', () => {
  let jsonController: JsonController;
  let mockJsonService: jest.Mocked<JsonService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockJsonService = {
      escapeJson: jest.fn(),
      unescapeJson: jest.fn(),
      formatJson: jest.fn()
    } as unknown as jest.Mocked<JsonService>;
    
    // @ts-ignore - for testing purposes
    JsonService.mockImplementation(() => mockJsonService);
    
    jsonController = new JsonController();

    // Setup response mock
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();
    mockResponse = {
      json: jsonMock,
      status: statusMock,
    };
  });

  describe('escapeJson', () => {
    it('should return escaped JSON when input is valid', async () => {
      const input = '{"test":"value"}';
      mockRequest = {
        body: { input }
      };

      mockJsonService.escapeJson.mockReturnValue('{\\"test\\":\\"value\\"}');

      await jsonController.escapeJson(mockRequest as Request, mockResponse as Response);

      expect(mockJsonService.escapeJson).toHaveBeenCalledWith(input);
      expect(jsonMock).toHaveBeenCalledWith({
        result: '{\\"test\\":\\"value\\"}'
      });
    });

    it('should return 400 when input is missing', async () => {
      mockRequest = {
        body: {}
      };

      await jsonController.escapeJson(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Input must be a string'
      });
    });

    it('should return 400 when input is not a string', async () => {
      mockRequest = {
        body: { input: 123 }
      };

      await jsonController.escapeJson(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Input must be a string'
      });
    });

    it('should return 400 when service throws an error', async () => {
      mockRequest = {
        body: { input: '{"test":"value"}' }
      };

      mockJsonService.escapeJson.mockImplementation(() => {
        throw new Error('Service error');
      });

      await jsonController.escapeJson(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Service error'
      });
    });
  });

  describe('unescapeJson', () => {
    it('should return unescaped JSON when input is valid', async () => {
      const input = '{\\"test\\":\\"value\\"}';
      mockRequest = {
        body: { input }
      };

      mockJsonService.unescapeJson.mockReturnValue('{"test":"value"}');

      await jsonController.unescapeJson(mockRequest as Request, mockResponse as Response);

      expect(mockJsonService.unescapeJson).toHaveBeenCalledWith(input);
      expect(jsonMock).toHaveBeenCalledWith({
        result: '{"test":"value"}'
      });
    });

    it('should return 400 when input is missing', async () => {
      mockRequest = {
        body: {}
      };

      await jsonController.unescapeJson(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Input must be a string'
      });
    });

    it('should return 400 when service throws an error', async () => {
      mockRequest = {
        body: { input: 'invalid json' }
      };

      mockJsonService.unescapeJson.mockImplementation(() => {
        throw new Error('Service error');
      });

      await jsonController.unescapeJson(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Service error'
      });
    });
  });

  describe('formatJson', () => {
    it('should return formatted JSON when input is valid', async () => {
      const input = '{"test":"value"}';
      mockRequest = {
        body: { input }
      };

      const formattedJson = `{
  "test": "value"
}`;
      mockJsonService.formatJson.mockReturnValue(formattedJson);

      await jsonController.formatJson(mockRequest as Request, mockResponse as Response);

      expect(mockJsonService.formatJson).toHaveBeenCalledWith(input);
      expect(jsonMock).toHaveBeenCalledWith({
        result: formattedJson
      });
    });

    it('should return 400 when input is missing', async () => {
      mockRequest = {
        body: {}
      };

      await jsonController.formatJson(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Input must be a string'
      });
    });

    it('should return 400 when service throws an error', async () => {
      mockRequest = {
        body: { input: 'invalid json' }
      };

      mockJsonService.formatJson.mockImplementation(() => {
        throw new Error('Service error');
      });

      await jsonController.formatJson(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Service error'
      });
    });
  });
}); 