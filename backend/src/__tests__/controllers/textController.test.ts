import { Request, Response } from 'express';
import { TextController } from '../../controllers/textController';
import { ITextFormatter } from '../../services/textFormatter';
import { AppError } from '../../middleware/errorHandler';

describe('TextController', () => {
  let textController: TextController;
  let mockTextFormatter: jest.Mocked<ITextFormatter>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockTextFormatter = {
      toCamelCase: jest.fn(),
      toSnakeCase: jest.fn(),
      toPascalCase: jest.fn(),
      toKebabCase: jest.fn()
    };
    
    textController = new TextController(mockTextFormatter);

    // Setup response mock
    jsonMock = jest.fn();
    mockResponse = {
      json: jsonMock
    };
  });

  describe('convertCase', () => {
    it('should convert to camelCase when type is camel', async () => {
      const text = 'hello world';
      mockRequest = {
        body: { text, type: 'camel' }
      };

      mockTextFormatter.toCamelCase.mockReturnValue('helloWorld');

      await textController.convertCase(mockRequest as Request, mockResponse as Response);

      expect(mockTextFormatter.toCamelCase).toHaveBeenCalledWith(text);
      expect(jsonMock).toHaveBeenCalledWith({
        result: 'helloWorld'
      });
    });

    it('should convert to snake_case when type is snake', async () => {
      const text = 'hello world';
      mockRequest = {
        body: { text, type: 'snake' }
      };

      mockTextFormatter.toSnakeCase.mockReturnValue('hello_world');

      await textController.convertCase(mockRequest as Request, mockResponse as Response);

      expect(mockTextFormatter.toSnakeCase).toHaveBeenCalledWith(text);
      expect(jsonMock).toHaveBeenCalledWith({
        result: 'hello_world'
      });
    });

    it('should convert to PascalCase when type is pascal', async () => {
      const text = 'hello world';
      mockRequest = {
        body: { text, type: 'pascal' }
      };

      mockTextFormatter.toPascalCase.mockReturnValue('HelloWorld');

      await textController.convertCase(mockRequest as Request, mockResponse as Response);

      expect(mockTextFormatter.toPascalCase).toHaveBeenCalledWith(text);
      expect(jsonMock).toHaveBeenCalledWith({
        result: 'HelloWorld'
      });
    });

    it('should convert to kebab-case when type is kebab', async () => {
      const text = 'hello world';
      mockRequest = {
        body: { text, type: 'kebab' }
      };

      mockTextFormatter.toKebabCase.mockReturnValue('hello-world');

      await textController.convertCase(mockRequest as Request, mockResponse as Response);

      expect(mockTextFormatter.toKebabCase).toHaveBeenCalledWith(text);
      expect(jsonMock).toHaveBeenCalledWith({
        result: 'hello-world'
      });
    });

    it('should throw error when text is missing', async () => {
      mockRequest = {
        body: { type: 'camel' }
      };

      await expect(textController.convertCase(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Text input is required'));
    });

    it('should throw error when text is not a string', async () => {
      mockRequest = {
        body: { text: 123, type: 'camel' }
      };

      await expect(textController.convertCase(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Text input is required'));
    });

    it('should throw error when type is missing', async () => {
      mockRequest = {
        body: { text: 'hello world' }
      };

      await expect(textController.convertCase(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Invalid conversion type'));
    });

    it('should throw error when type is invalid', async () => {
      mockRequest = {
        body: { text: 'hello world', type: 'invalid' }
      };

      await expect(textController.convertCase(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Invalid conversion type'));
    });

    it('should handle formatter errors', async () => {
      const text = 'hello world';
      mockRequest = {
        body: { text, type: 'camel' }
      };

      mockTextFormatter.toCamelCase.mockImplementation(() => {
        throw new Error('Formatter error');
      });

      await expect(textController.convertCase(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow('Formatter error');
    });
  });
}); 