import { Request, Response } from 'express';
import { RegexController } from '../../controllers/regexController';
import { RegexService } from '../../services/regexService';

// Mock RegexService
jest.mock('../../services/regexService');

describe('RegexController', () => {
  let regexController: RegexController;
  let mockRegexService: jest.Mocked<RegexService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockRegexService = {
      testRegex: jest.fn(),
      validatePattern: jest.fn(),
      getCommonPatterns: jest.fn()
    } as unknown as jest.Mocked<RegexService>;
    
    // @ts-ignore - for testing purposes
    RegexService.mockImplementation(() => mockRegexService);
    
    regexController = new RegexController();

    // Setup response mock
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();
    mockResponse = {
      json: jsonMock,
      status: statusMock,
    };
  });

  describe('testRegex', () => {
    it('should return regex test results when input is valid', () => {
      const pattern = '^test$';
      const flags = 'i';
      const text = 'test';
      mockRequest = {
        body: { pattern, flags, text }
      };

      const testResult = {
        isValid: true,
        matches: [{
          text: 'test',
          index: 0,
          groups: {},
          match: 'test'
        }],
        groups: {},
        matchedText: 'test'
      };
      mockRegexService.testRegex.mockReturnValue(testResult);

      regexController.testRegex(mockRequest as Request, mockResponse as Response);

      expect(mockRegexService.testRegex).toHaveBeenCalledWith(pattern, flags, text);
      expect(jsonMock).toHaveBeenCalledWith(testResult);
    });

    it('should handle regex test with no flags', () => {
      const pattern = '^test$';
      const text = 'test';
      mockRequest = {
        body: { pattern, text }
      };

      const testResult = {
        isValid: true,
        matches: [{
          text: 'test',
          index: 0,
          groups: {},
          match: 'test'
        }],
        groups: {},
        matchedText: 'test'
      };
      mockRegexService.testRegex.mockReturnValue(testResult);

      regexController.testRegex(mockRequest as Request, mockResponse as Response);

      expect(mockRegexService.testRegex).toHaveBeenCalledWith(pattern, '', text);
      expect(jsonMock).toHaveBeenCalledWith(testResult);
    });

    it('should return 400 when pattern is missing', () => {
      mockRequest = {
        body: { text: 'test' }
      };

      regexController.testRegex(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Pattern and text are required'
      });
    });

    it('should return 400 when text is missing', () => {
      mockRequest = {
        body: { pattern: '^test$' }
      };

      regexController.testRegex(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Pattern and text are required'
      });
    });
  });

  describe('validatePattern', () => {
    it('should return validation result when pattern is valid', () => {
      const pattern = '^test$';
      const flags = 'i';
      mockRequest = {
        body: { pattern, flags }
      };

      const validationResult = {
        isValid: true,
        error: undefined
      };
      mockRegexService.validatePattern.mockReturnValue(validationResult);

      regexController.validatePattern(mockRequest as Request, mockResponse as Response);

      expect(mockRegexService.validatePattern).toHaveBeenCalledWith(pattern, flags);
      expect(jsonMock).toHaveBeenCalledWith(validationResult);
    });

    it('should handle validation with no flags', () => {
      const pattern = '^test$';
      mockRequest = {
        body: { pattern }
      };

      const validationResult = {
        isValid: true,
        error: undefined
      };
      mockRegexService.validatePattern.mockReturnValue(validationResult);

      regexController.validatePattern(mockRequest as Request, mockResponse as Response);

      expect(mockRegexService.validatePattern).toHaveBeenCalledWith(pattern, '');
      expect(jsonMock).toHaveBeenCalledWith(validationResult);
    });

    it('should return 400 when pattern is missing', () => {
      mockRequest = {
        body: { flags: 'i' }
      };

      regexController.validatePattern(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Pattern is required'
      });
    });
  });

  describe('getCommonPatterns', () => {
    it('should return list of common patterns', () => {
      const commonPatterns = [
        { 
          name: 'Email',
          pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
          description: 'Matches email addresses'
        },
        { 
          name: 'URL',
          pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
          description: 'Matches URLs'
        }
      ];
      mockRegexService.getCommonPatterns.mockReturnValue(commonPatterns);

      regexController.getCommonPatterns({} as Request, mockResponse as Response);

      expect(mockRegexService.getCommonPatterns).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(commonPatterns);
    });
  });
}); 