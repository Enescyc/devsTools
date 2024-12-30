import { Request, Response } from 'express';
import { ConverterController } from '../converterController';
import { ConverterService } from '../../services/converterService';

jest.mock('../../services/converterService');

const MockConverterService = ConverterService as jest.MockedClass<typeof ConverterService>;

describe('ConverterController', () => {
  let converterController: ConverterController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create mock response
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnThis();
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };

    // Reset mock implementation
    MockConverterService.prototype.jsonToCsv = jest.fn().mockImplementation((input: string) => {
      if (input === 'invalid json') throw new Error('Failed to convert JSON to CSV');
      return 'mocked csv output';
    });

    MockConverterService.prototype.jsonToXml = jest.fn().mockImplementation((input: string) => {
      if (input === 'invalid json') throw new Error('Failed to convert JSON to XML');
      return 'mocked xml output';
    });

    MockConverterService.prototype.jsonToYaml = jest.fn().mockImplementation((input: string) => {
      if (input === 'invalid json') throw new Error('Failed to convert JSON to YAML');
      return 'mocked yaml output';
    });

    converterController = new ConverterController();
  });

  describe('jsonToCsv', () => {
    it('should convert valid JSON to CSV', async () => {
      const input = JSON.stringify({ name: 'John', age: 30 });
      mockRequest = {
        body: { input },
      };

      await converterController.jsonToCsv(mockRequest as Request, mockResponse as Response);

      expect(MockConverterService.prototype.jsonToCsv).toHaveBeenCalledWith(input);
      expect(mockJson).toHaveBeenCalledWith({ result: 'mocked csv output' });
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it('should handle invalid input', async () => {
      mockRequest = {
        body: { input: null },
      };

      await converterController.jsonToCsv(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Input must be a string',
      });
    });

    it('should handle conversion errors', async () => {
      const input = 'invalid json';
      mockRequest = {
        body: { input },
      };

      await converterController.jsonToCsv(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Failed to convert JSON to CSV',
      });
    });
  });

  describe('jsonToXml', () => {
    it('should convert valid JSON to XML', async () => {
      const input = JSON.stringify({ name: 'John', age: 30 });
      mockRequest = {
        body: { input },
      };

      await converterController.jsonToXml(mockRequest as Request, mockResponse as Response);

      expect(MockConverterService.prototype.jsonToXml).toHaveBeenCalledWith(input);
      expect(mockJson).toHaveBeenCalledWith({ result: 'mocked xml output' });
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it('should handle invalid input', async () => {
      mockRequest = {
        body: { input: null },
      };

      await converterController.jsonToXml(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Input must be a string',
      });
    });

    it('should handle conversion errors', async () => {
      const input = 'invalid json';
      mockRequest = {
        body: { input },
      };

      await converterController.jsonToXml(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Failed to convert JSON to XML',
      });
    });
  });

  describe('jsonToYaml', () => {
    it('should convert valid JSON to YAML', async () => {
      const input = JSON.stringify({ name: 'John', age: 30 });
      mockRequest = {
        body: { input },
      };

      await converterController.jsonToYaml(mockRequest as Request, mockResponse as Response);

      expect(MockConverterService.prototype.jsonToYaml).toHaveBeenCalledWith(input);
      expect(mockJson).toHaveBeenCalledWith({ result: 'mocked yaml output' });
      expect(mockStatus).not.toHaveBeenCalled();
    });

    it('should handle invalid input', async () => {
      mockRequest = {
        body: { input: null },
      };

      await converterController.jsonToYaml(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Input must be a string',
      });
    });

    it('should handle conversion errors', async () => {
      const input = 'invalid json';
      mockRequest = {
        body: { input },
      };

      await converterController.jsonToYaml(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        error: 'Failed to convert JSON to YAML',
      });
    });
  });
}); 