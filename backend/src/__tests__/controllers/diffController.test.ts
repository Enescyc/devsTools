import { Request, Response } from 'express';
import { DiffController } from '../../controllers/diffController';
import { DiffService } from '../../services/diffService';

// Mock DiffService
jest.mock('../../services/diffService');

describe('DiffController', () => {
  let diffController: DiffController;
  let mockDiffService: jest.Mocked<DiffService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockDiffService = {
      computeDiff: jest.fn(),
      computeInlineDiff: jest.fn()
    } as unknown as jest.Mocked<DiffService>;
    
    // @ts-ignore - for testing purposes
    DiffService.mockImplementation(() => mockDiffService);
    
    diffController = new DiffController();

    // Setup response mock
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();
    mockResponse = {
      json: jsonMock,
      status: statusMock,
    };
  });

  describe('computeDiff', () => {
    it('should return diff when both texts are provided', () => {
      const oldText = 'old text';
      const newText = 'new text';
      mockRequest = {
        body: { oldText, newText }
      };

      const diffResult = {
        lines: [
          {
            type: 'removed' as const,
            content: 'old text',
            lineNumber: { left: 1 }
          },
          {
            type: 'added' as const,
            content: 'new text',
            lineNumber: { right: 1 }
          }
        ],
        stats: {
          additions: 1,
          deletions: 1,
          unchanged: 0
        }
      };
      mockDiffService.computeDiff.mockReturnValue(diffResult);

      diffController.computeDiff(mockRequest as Request, mockResponse as Response);

      expect(mockDiffService.computeDiff).toHaveBeenCalledWith(oldText, newText);
      expect(jsonMock).toHaveBeenCalledWith(diffResult);
    });

    it('should return 400 when oldText is missing', () => {
      mockRequest = {
        body: { newText: 'new text' }
      };

      diffController.computeDiff(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Both old and new text are required'
      });
    });

    it('should return 400 when newText is missing', () => {
      mockRequest = {
        body: { oldText: 'old text' }
      };

      diffController.computeDiff(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Both old and new text are required'
      });
    });
  });

  describe('computeInlineDiff', () => {
    it('should return inline diff when both lines are provided', () => {
      const oldLine = 'old line';
      const newLine = 'new line';
      mockRequest = {
        body: { oldLine, newLine }
      };

      const inlineDiffResult = {
        added: ['new'],
        removed: ['old']
      };
      mockDiffService.computeInlineDiff.mockReturnValue(inlineDiffResult);

      diffController.computeInlineDiff(mockRequest as Request, mockResponse as Response);

      expect(mockDiffService.computeInlineDiff).toHaveBeenCalledWith(oldLine, newLine);
      expect(jsonMock).toHaveBeenCalledWith(inlineDiffResult);
    });

    it('should return 400 when oldLine is missing', () => {
      mockRequest = {
        body: { newLine: 'new line' }
      };

      diffController.computeInlineDiff(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Both old and new lines are required'
      });
    });

    it('should return 400 when newLine is missing', () => {
      mockRequest = {
        body: { oldLine: 'old line' }
      };

      diffController.computeInlineDiff(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        error: 'Both old and new lines are required'
      });
    });
  });
}); 