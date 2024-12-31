import { Request, Response } from 'express';
import { EncoderController } from '../../controllers/encoderController';
import { IEncoderService } from '../../services/encoderService';
import { AppError } from '../../middleware/errorHandler';

describe('EncoderController', () => {
  let encoderController: EncoderController;
  let mockEncoderService: jest.Mocked<IEncoderService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockEncoderService = {
      encodeBase64: jest.fn(),
      decodeBase64: jest.fn(),
      encodeUrl: jest.fn(),
      decodeUrl: jest.fn(),
      encodeHtml: jest.fn(),
      decodeHtml: jest.fn()
    };
    
    encoderController = new EncoderController(mockEncoderService);

    // Setup response mock
    jsonMock = jest.fn();
    mockResponse = {
      json: jsonMock
    };
  });

  describe('encode', () => {
    it('should encode text to base64', async () => {
      const text = 'test text';
      mockRequest = {
        body: { text, type: 'base64' }
      };

      mockEncoderService.encodeBase64.mockReturnValue('dGVzdCB0ZXh0');

      await encoderController.encode(mockRequest as Request, mockResponse as Response);

      expect(mockEncoderService.encodeBase64).toHaveBeenCalledWith(text);
      expect(jsonMock).toHaveBeenCalledWith({
        result: 'dGVzdCB0ZXh0'
      });
    });

    it('should encode text to URL format', async () => {
      const text = 'test text';
      mockRequest = {
        body: { text, type: 'url' }
      };

      mockEncoderService.encodeUrl.mockReturnValue('test%20text');

      await encoderController.encode(mockRequest as Request, mockResponse as Response);

      expect(mockEncoderService.encodeUrl).toHaveBeenCalledWith(text);
      expect(jsonMock).toHaveBeenCalledWith({
        result: 'test%20text'
      });
    });

    it('should encode text to HTML format', async () => {
      const text = '<test>';
      mockRequest = {
        body: { text, type: 'html' }
      };

      mockEncoderService.encodeHtml.mockReturnValue('&lt;test&gt;');

      await encoderController.encode(mockRequest as Request, mockResponse as Response);

      expect(mockEncoderService.encodeHtml).toHaveBeenCalledWith(text);
      expect(jsonMock).toHaveBeenCalledWith({
        result: '&lt;test&gt;'
      });
    });

    it('should throw error when text is missing for encoding', async () => {
      mockRequest = {
        body: { type: 'base64' }
      };

      await expect(encoderController.encode(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Text input is required'));
    });

    it('should throw error when text is not a string for encoding', async () => {
      mockRequest = {
        body: { text: 123, type: 'base64' }
      };

      await expect(encoderController.encode(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Text input is required'));
    });

    it('should throw error when encoding type is missing', async () => {
      mockRequest = {
        body: { text: 'test text' }
      };

      await expect(encoderController.encode(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Unsupported encoding type'));
    });

    it('should throw error when encoding type is invalid', async () => {
      mockRequest = {
        body: { text: 'test text', type: 'invalid' }
      };

      await expect(encoderController.encode(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Unsupported encoding type'));
    });

    it('should handle encoding service errors', async () => {
      mockRequest = {
        body: { text: 'test text', type: 'base64' }
      };

      mockEncoderService.encodeBase64.mockImplementation(() => {
        throw new Error('Encoding error');
      });

      await expect(encoderController.encode(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Failed to encode text'));
    });
  });

  describe('decode', () => {
    it('should decode text from base64', async () => {
      const text = 'dGVzdCB0ZXh0';
      mockRequest = {
        body: { text, type: 'base64' }
      };

      mockEncoderService.decodeBase64.mockReturnValue('test text');

      await encoderController.decode(mockRequest as Request, mockResponse as Response);

      expect(mockEncoderService.decodeBase64).toHaveBeenCalledWith(text);
      expect(jsonMock).toHaveBeenCalledWith({
        result: 'test text'
      });
    });

    it('should decode text from URL format', async () => {
      const text = 'test%20text';
      mockRequest = {
        body: { text, type: 'url' }
      };

      mockEncoderService.decodeUrl.mockReturnValue('test text');

      await encoderController.decode(mockRequest as Request, mockResponse as Response);

      expect(mockEncoderService.decodeUrl).toHaveBeenCalledWith(text);
      expect(jsonMock).toHaveBeenCalledWith({
        result: 'test text'
      });
    });

    it('should decode text from HTML format', async () => {
      const text = '&lt;test&gt;';
      mockRequest = {
        body: { text, type: 'html' }
      };

      mockEncoderService.decodeHtml.mockReturnValue('<test>');

      await encoderController.decode(mockRequest as Request, mockResponse as Response);

      expect(mockEncoderService.decodeHtml).toHaveBeenCalledWith(text);
      expect(jsonMock).toHaveBeenCalledWith({
        result: '<test>'
      });
    });

    it('should throw error when text is missing for decoding', async () => {
      mockRequest = {
        body: { type: 'base64' }
      };

      await expect(encoderController.decode(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Text input is required'));
    });

    it('should throw error when text is not a string for decoding', async () => {
      mockRequest = {
        body: { text: 123, type: 'base64' }
      };

      await expect(encoderController.decode(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Text input is required'));
    });

    it('should throw error when decoding type is missing', async () => {
      mockRequest = {
        body: { text: 'test text' }
      };

      await expect(encoderController.decode(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Unsupported decoding type'));
    });

    it('should throw error when decoding type is invalid', async () => {
      mockRequest = {
        body: { text: 'test text', type: 'invalid' }
      };

      await expect(encoderController.decode(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Unsupported decoding type'));
    });

    it('should handle decoding service errors', async () => {
      mockRequest = {
        body: { text: 'invalid base64', type: 'base64' }
      };

      mockEncoderService.decodeBase64.mockImplementation(() => {
        throw new Error('Decoding error');
      });

      await expect(encoderController.decode(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(new AppError(400, 'Failed to decode text'));
    });
  });
}); 